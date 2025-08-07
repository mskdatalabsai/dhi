// api/intent/detect/route.ts - Using OpenAI for intent detection

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey:
    "REMOVED_SECRET",
});

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

const INTENT_DETECTION_PROMPT = `You are an expert career advisor specializing in IT career paths. Analyze the user's profile and determine their career intent.

User Profile:
- Age Group: {age_group}
- Education: {education}
- Experience Level: {experience}
- Current Role: {current_role}
- Target/Interest Roles: {target_roles}
- Purpose: {purpose}
- Functional Area Interest: {functional_area}

Classify the user's intent into EXACTLY ONE of these categories:
1. "confused" - Exploring multiple domains without clear direction
2. "interested" - Evaluating specific roles with some clarity
3. "grow" - Advancing in their current role/domain
4. "switch" - Transitioning from current role to new role(s)

Consider these patterns:
- Freshers (0 years) without specific targets → "confused"
- Freshers with specific role interests → "interested"
- Experienced professionals in a role without targets → "grow"
- Experienced professionals with different target roles → "switch"
- Non-IT background exploring IT → usually "confused" or "interested"
- Students exploring options → usually "confused"

Provide your analysis in the following JSON format:
{
  "intent": "confused|interested|grow|switch",
  "confidence": 0.0-1.0,
  "reasoning": "Explain why this intent was chosen based on their profile",
  "recommendedPath": "Specific actionable advice for their situation",
  "careerInsights": "Key insights about their career trajectory",
  "skillGaps": ["List of potential skill gaps to address"],
  "suggestedLearningPath": ["Ordered list of skills/topics to learn"]
}

Be specific and actionable in your recommendations. Consider the Indian IT job market context.`;

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

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      // Fallback to basic logic if OpenAI is not configured
      return fallbackIntentDetection(body);
    }

    // Format the prompt with user data
    const formattedPrompt = INTENT_DETECTION_PROMPT.replace(
      "{age_group}",
      body.age_group || "Not specified"
    )
      .replace("{education}", body.education || "Not specified")
      .replace("{experience}", body.experience || "Not specified")
      .replace("{current_role}", body.current_role || "None")
      .replace(
        "{target_roles}",
        body.target_roles?.join(", ") || "None specified"
      )
      .replace("{purpose}", body.purpose || "Not specified")
      .replace("{functional_area}", body.functional_area || "Not specified");

    console.log("Detecting intent with OpenAI for user profile:", {
      experience: body.experience,
      current_role: body.current_role,
      target_roles: body.target_roles,
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-3.5-turbo" for cost savings
      messages: [
        {
          role: "system",
          content:
            "You are an expert career advisor. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: formattedPrompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent classification
      max_tokens: 800,
      response_format: { type: "json_object" }, // Ensure JSON response
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Parse OpenAI response
    const aiResponse = JSON.parse(responseText);

    // Validate the response has required fields
    if (
      !aiResponse.intent ||
      !["confused", "interested", "grow", "switch"].includes(aiResponse.intent)
    ) {
      throw new Error("Invalid intent classification from AI");
    }

    // Ensure confidence is a number between 0 and 1
    const confidence = Math.max(
      0,
      Math.min(1, parseFloat(aiResponse.confidence) || 0.8)
    );

    const response: IntentDetectionResponse = {
      intent: aiResponse.intent,
      confidence: confidence,
      reasoning:
        aiResponse.reasoning || "Intent detected based on profile analysis",
      recommendedPath:
        aiResponse.recommendedPath ||
        "Complete the assessment to get personalized recommendations",
      careerInsights: aiResponse.careerInsights,
      skillGaps: aiResponse.skillGaps || [],
      suggestedLearningPath: aiResponse.suggestedLearningPath || [],
    };

    console.log("OpenAI intent detection result:", {
      intent: response.intent,
      confidence: response.confidence,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in OpenAI intent detection:", error);

    // Fallback to basic logic if OpenAI fails
    return fallbackIntentDetection(body);
  }
}

// Fallback function using basic rules if OpenAI fails
function fallbackIntentDetection(body: IntentDetectionRequest): NextResponse {
  console.log("Using fallback intent detection");

  const { experience, current_role, target_roles, purpose } = body;

  let intent: IntentDetectionResponse["intent"] = "confused";
  const confidence = 0.7;
  let reasoning = "Detected using rule-based analysis";
  let recommendedPath = "Complete the assessment for personalized guidance";

  // Basic rule-based logic
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

  // Purpose-based adjustments
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
