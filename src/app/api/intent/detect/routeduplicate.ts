/* eslint-disable @typescript-eslint/no-explicit-any */
// api/intent/detect/route.ts - Using Hugging Face for intent detection

import { NextRequest, NextResponse } from "next/server";

// Hugging Face Inference API client
class HuggingFaceClient {
  private apiKey: string;
  private baseURL = "https://api-inference.huggingface.co/models";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async query(model: string, inputs: any) {
    const response = await fetch(`${this.baseURL}/${model}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Hugging Face API error: ${response.status} - ${errorText}`
      );
    }

    return response.json();
  }

  async generateText(prompt: string) {
    // Try multiple models in order of preference
    const models = [
      "gpt2", // Most basic, should always work
      "facebook/bart-large", // Since bart-large-mnli works
      "microsoft/DialoGPT-small", // Smaller version
      "google/flan-t5-small", // Instruction following
      "EleutherAI/gpt-neo-125M", // Alternative GPT
    ];

    for (const model of models) {
      try {
        console.log(`Trying text generation with model: ${model}`);

        const result = await this.query(model, {
          inputs: prompt,
          parameters: {
            max_length: model.includes("gpt") ? 400 : 500,
            temperature: 0.3,
            return_full_text: false,
          },
        });

        console.log(`✅ Success with model: ${model}`);
        return result;
      } catch (error) {
        if (error instanceof Error) {
          console.log(`❌ Failed with model ${model}:`, error.message);
        } else {
          console.log(`❌ Failed with model ${model}:`, error);
        }
        continue; // Try next model
      }
    }

    // If all models fail, throw error
    throw new Error("All text generation models failed");
  }

  // Using classification model for intent detection
  async classifyIntent(text: string) {
    // Using a general classification model
    const model = "facebook/bart-large-mnli";

    const labels = [
      "user is confused about career direction and needs exploration",
      "user is interested in specific roles and has clear direction",
      "user wants to grow and advance in current role",
      "user wants to switch careers to different roles",
    ];

    const result = await this.query(model, {
      inputs: text,
      parameters: {
        candidate_labels: labels,
      },
    });

    return result;
  }
}

interface IntentDetectionRequest {
  purpose: string;
  experience: string;
  current_role?: string;
  target_roles?: string[];
  age_group?: string;
  education?: string;
  functional_area?: string;
}

interface IntentDetectionResponse {
  intent: "confused" | "interested" | "grow" | "switch";
  confidence: number;
  reasoning: string;
  recommendedPath: string;
  careerInsights?: string;
  skillGaps?: string[];
  suggestedLearningPath?: string[];
}

function createAnalysisText(body: IntentDetectionRequest): string {
  return `Career Profile Analysis:
Age Group: ${body.age_group || "Not specified"}
Education: ${body.education || "Not specified"}
Experience: ${body.experience || "Not specified"}
Current Role: ${body.current_role || "None"}
Target Roles: ${body.target_roles?.join(", ") || "None specified"}
Purpose: ${body.purpose || "Not specified"}
Functional Area: ${body.functional_area || "Not specified"}

Based on this profile, the user's career intent needs to be classified as one of: confused (exploring options), interested (specific role focus), grow (advance current role), or switch (change careers).`;
}

function createDetailedPrompt(body: IntentDetectionRequest): string {
  return `You are an expert career advisor. Analyze this career profile and respond with valid JSON only.

${createAnalysisText(body)}

Classification rules:
- "confused": Exploring multiple domains without clear direction
- "interested": Evaluating specific roles with some clarity  
- "grow": Advancing in current role/domain
- "switch": Transitioning from current role to new role(s)

Respond with this exact JSON format:
{
  "intent": "confused|interested|grow|switch",
  "confidence": 0.8,
  "reasoning": "Brief explanation of classification",
  "recommendedPath": "Specific actionable advice",
  "careerInsights": "Key insights about trajectory", 
  "skillGaps": ["skill1", "skill2"],
  "suggestedLearningPath": ["step1", "step2", "step3"]
}`;
}

export async function POST(request: NextRequest) {
  let body: IntentDetectionRequest = {
    purpose: "",
    experience: "",
    current_role: undefined,
    target_roles: undefined,
    age_group: undefined,
    education: undefined,
    functional_area: undefined,
  };

  try {
    body = await request.json();

    // Validate Hugging Face API key
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("Hugging Face API key not configured");
      return fallbackIntentDetection(body);
    }

    const hfClient = new HuggingFaceClient(process.env.HUGGINGFACE_API_KEY);

    console.log("Detecting intent with Hugging Face for user profile:", {
      experience: body.experience,
      current_role: body.current_role,
      target_roles: body.target_roles,
    });

    // Method 1: Using classification approach
    const analysisText = createAnalysisText(body);
    const classificationResult = await hfClient.classifyIntent(analysisText);

    let intent: IntentDetectionResponse["intent"] = "confused";
    let confidence = 0.7;

    // Map classification results to our intents
    if (classificationResult.labels && classificationResult.scores) {
      const topLabel = classificationResult.labels[0];
      confidence = classificationResult.scores[0];

      if (topLabel.includes("confused")) intent = "confused";
      else if (topLabel.includes("interested")) intent = "interested";
      else if (topLabel.includes("grow")) intent = "grow";
      else if (topLabel.includes("switch")) intent = "switch";
    }

    // Generate additional insights using text generation
    let careerInsights = "";
    let skillGaps: string[] = [];
    let suggestedLearningPath: string[] = [];
    let reasoning = "Intent detected using AI classification";
    let recommendedPath = "Complete the assessment for personalized guidance";

    try {
      // Try to get more detailed analysis
      const detailedPrompt = createDetailedPrompt(body);
      const textResult = await hfClient.generateText(detailedPrompt);

      // Try to parse JSON response (different models return different formats)
      let generatedText = "";

      if (Array.isArray(textResult) && textResult[0]?.generated_text) {
        // Format for some models like GPT-2
        generatedText = textResult[0].generated_text;
      } else if (typeof textResult === "string") {
        // Format for T5 models
        generatedText = textResult;
      } else if (textResult?.generated_text) {
        // Another possible format
        generatedText = textResult.generated_text;
      }

      if (generatedText) {
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const parsedResult = JSON.parse(jsonMatch[0]);

          if (
            parsedResult.intent &&
            ["confused", "interested", "grow", "switch"].includes(
              parsedResult.intent
            )
          ) {
            intent = parsedResult.intent;
            confidence = Math.max(
              0,
              Math.min(1, parseFloat(parsedResult.confidence) || confidence)
            );
            reasoning = parsedResult.reasoning || reasoning;
            recommendedPath = parsedResult.recommendedPath || recommendedPath;
            careerInsights = parsedResult.careerInsights || "";
            skillGaps = parsedResult.skillGaps || [];
            suggestedLearningPath = parsedResult.suggestedLearningPath || [];
          }
        }
      }
    } catch (detailedError) {
      console.log(
        "Detailed analysis failed, using classification result:",
        detailedError
      );
      // Continue with classification-only result
    }

    // Add rule-based adjustments
    const adjustedResult = applyRuleBasedAdjustments(
      body,
      intent,
      confidence,
      reasoning,
      recommendedPath
    );

    const response: IntentDetectionResponse = {
      intent: adjustedResult.intent,
      confidence: adjustedResult.confidence,
      reasoning: adjustedResult.reasoning,
      recommendedPath: adjustedResult.recommendedPath,
      careerInsights:
        careerInsights || "Complete assessment for detailed insights",
      skillGaps: skillGaps,
      suggestedLearningPath: suggestedLearningPath,
    };

    console.log("Hugging Face intent detection result:", {
      intent: response.intent,
      confidence: response.confidence,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in Hugging Face intent detection:", error);
    return fallbackIntentDetection(body);
  }
}

// Apply rule-based adjustments to improve accuracy
function applyRuleBasedAdjustments(
  body: IntentDetectionRequest,
  intent: IntentDetectionResponse["intent"],
  confidence: number,
  reasoning: string,
  recommendedPath: string
) {
  const { experience, current_role, target_roles, purpose } = body;
  const isFresher = experience === "Fresher (0 years)";
  const hasCurrentRole = current_role && current_role !== "None";
  const hasTargetRoles = target_roles && target_roles.length > 0;

  // Strong rule-based overrides for clear cases
  if (isFresher && !hasTargetRoles) {
    return {
      intent: "confused" as const,
      confidence: Math.max(confidence, 0.85),
      reasoning:
        "Fresher exploring options without specific targets - needs career exploration",
      recommendedPath:
        "Explore multiple IT domains through internships and projects to discover your interests",
    };
  }

  if (isFresher && hasTargetRoles) {
    return {
      intent: "interested" as const,
      confidence: Math.max(confidence, 0.8),
      reasoning:
        "Fresher with specific role interests - ready for targeted development",
      recommendedPath: `Focus on building skills for ${target_roles?.join(
        " or "
      )} while staying open to related opportunities`,
    };
  }

  if (hasCurrentRole && !hasTargetRoles) {
    return {
      intent: "grow" as const,
      confidence: Math.max(confidence, 0.8),
      reasoning:
        "Experienced professional seeking advancement in current domain",
      recommendedPath:
        "Deepen expertise and leadership skills in your current role",
    };
  }

  if (hasCurrentRole && hasTargetRoles && current_role !== target_roles?.[0]) {
    return {
      intent: "switch" as const,
      confidence: Math.max(confidence, 0.85),
      reasoning:
        "Experienced professional planning career transition to different role",
      recommendedPath: `Assess transferable skills and bridge gaps for transition to ${target_roles?.join(
        " or "
      )}`,
    };
  }

  // Purpose-based adjustments
  if (purpose?.includes("role validation")) {
    return {
      intent: "grow" as const,
      confidence: Math.max(confidence, 0.8),
      reasoning: "Seeking to validate and enhance current expertise",
      recommendedPath:
        "Validate your current skills and identify growth areas in your domain",
    };
  }

  return { intent, confidence, reasoning, recommendedPath };
}

// Fallback function using basic rules if Hugging Face fails
function fallbackIntentDetection(body: IntentDetectionRequest): NextResponse {
  console.log("Using fallback intent detection");

  const { experience, current_role, target_roles, purpose } = body;

  let intent: IntentDetectionResponse["intent"] = "confused";
  const confidence = 0.7;
  let reasoning = "Detected using rule-based analysis";
  let recommendedPath = "Complete the assessment for personalized guidance";

  const isFresher = experience === "Fresher (0 years)";
  const hasCurrentRole = current_role && current_role !== "None";
  const hasTargetRoles = target_roles && target_roles.length > 0;

  if (isFresher && !hasTargetRoles) {
    intent = "confused";
    reasoning =
      "As a fresher exploring options, you'll benefit from broad exposure";
    recommendedPath = "Explore multiple domains to discover your interests";
  } else if (isFresher && hasTargetRoles) {
    intent = "interested";
    reasoning = "You have specific interests as a fresher";
    recommendedPath =
      "Focus on your selected roles while staying open to related opportunities";
  } else if (hasCurrentRole && !hasTargetRoles) {
    intent = "grow";
    reasoning = "Looking to advance in your current domain";
    recommendedPath = "Deepen expertise in your current role";
  } else if (hasCurrentRole && hasTargetRoles) {
    intent = "switch";
    reasoning = "Planning a career transition";
    recommendedPath = "Assess transferable skills for your target roles";
  }

  if (purpose?.includes("role validation")) {
    intent = "grow";
    reasoning = "Seeking to validate and enhance current expertise";
  }

  return NextResponse.json({
    intent,
    confidence,
    reasoning,
    recommendedPath,
    careerInsights: "Complete assessment for detailed insights",
    skillGaps: [],
    suggestedLearningPath: [],
    fallbackUsed: true,
  });
}
