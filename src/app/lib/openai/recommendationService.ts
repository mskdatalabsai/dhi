/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/openai/recommendationService.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    "REMOVED_SECRET",
});

interface TechnicalQuestion {
  questionId: string;
  question: string;
  category: string;
  level: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface QualitativeQuestion {
  questionId: string;
  question: string;
  category: string;
  level: string;
  userAnswer: string | null;
  timeSpent: number;
  answered: boolean;
}

interface AssessmentData {
  // Basic performance metrics
  technicalScore: number;
  technicalTotal: number;
  technicalPercentage: number;
  qualitativeTotal: number;

  // Intent and context
  intent: string;
  reasoning: string;
  recommendedPath: string;

  // Question details
  technicalQuestions: TechnicalQuestion[];
  qualitativeQuestions: QualitativeQuestion[];

  // User context
  profileSnapshot?: any;
  targetRoles?: string[];
  focusAreas?: string[];
}

interface AIRecommendation {
  summary: string;
  top_roles: string[];
  recommendations: string[];
  skill_analysis: {
    strengths: string[];
    improvement_areas: string[];
    learning_priority: string[];
  };
  career_insights: {
    immediate_next_steps: string[];
    long_term_goals: string[];
    industry_trends: string[];
  };
}

export class OpenAIRecommendationService {
  static async generateRecommendations(
    assessmentData: AssessmentData
  ): Promise<AIRecommendation> {
    try {
      // Prepare technical performance analysis
      const technicalAnalysis = this.analyzeTechnicalPerformance(
        assessmentData.technicalQuestions
      );

      // Prepare qualitative insights
      const qualitativeInsights = this.analyzeQualitativeResponses(
        assessmentData.qualitativeQuestions
      );

      // Create comprehensive prompt for OpenAI
      const prompt = this.createRecommendationPrompt(
        assessmentData,
        technicalAnalysis,
        qualitativeInsights
      );

      console.log("🤖 Sending assessment data to OpenAI for analysis...");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Use latest GPT-4 model
        messages: [
          {
            role: "system",
            content:
              "You are an expert career counselor and skills assessment specialist. Analyze the provided assessment data and generate personalized, actionable career recommendations. Be specific, practical, and encouraging.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error("No response from OpenAI");
      }

      const recommendations: AIRecommendation = JSON.parse(response);

      console.log("✅ OpenAI recommendations generated successfully");
      return recommendations;
    } catch (error) {
      console.error("❌ Error generating OpenAI recommendations:", error);

      // Return fallback recommendations
      return this.generateFallbackRecommendations(assessmentData);
    }
  }

  private static analyzeTechnicalPerformance(
    technicalQuestions: TechnicalQuestion[]
  ) {
    const categoryPerformance: {
      [key: string]: { total: number; correct: number; areas: string[] };
    } = {};
    const levelPerformance = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      advanced: { total: 0, correct: 0 },
    };

    technicalQuestions.forEach((q) => {
      // Category analysis
      if (!categoryPerformance[q.category]) {
        categoryPerformance[q.category] = { total: 0, correct: 0, areas: [] };
      }
      categoryPerformance[q.category].total++;
      if (q.isCorrect) categoryPerformance[q.category].correct++;
      if (!q.isCorrect)
        categoryPerformance[q.category].areas.push(
          q.question.substring(0, 100)
        );

      // Level analysis
      const level = q.level.toLowerCase() as keyof typeof levelPerformance;
      if (levelPerformance[level]) {
        levelPerformance[level].total++;
        if (q.isCorrect) levelPerformance[level].correct++;
      }
    });

    return {
      categoryPerformance,
      levelPerformance,
      totalQuestions: technicalQuestions.length,
      totalCorrect: technicalQuestions.filter((q) => q.isCorrect).length,
      weakAreas: Object.entries(categoryPerformance)
        .filter(
          ([_, perf]) => perf.total > 0 && perf.correct / perf.total < 0.6
        )
        .map(([category, _]) => category),
      strongAreas: Object.entries(categoryPerformance)
        .filter(
          ([_, perf]) => perf.total > 0 && perf.correct / perf.total >= 0.8
        )
        .map(([category, _]) => category),
    };
  }

  private static analyzeQualitativeResponses(
    qualitativeQuestions: QualitativeQuestion[]
  ) {
    const categoryResponses: { [key: string]: string[] } = {};
    const responsePatterns = {
      leadership: [] as string[],
      communication: [] as string[],
      problemSolving: [] as string[],
      teamwork: [] as string[],
      innovation: [] as string[],
    };

    qualitativeQuestions.forEach((q) => {
      if (q.answered && q.userAnswer) {
        // Group by category
        if (!categoryResponses[q.category]) {
          categoryResponses[q.category] = [];
        }
        categoryResponses[q.category].push(q.userAnswer);

        // Analyze for key themes
        const answer = q.userAnswer.toLowerCase();
        if (answer.includes("lead") || answer.includes("manage")) {
          responsePatterns.leadership.push(q.userAnswer);
        }
        if (
          answer.includes("communicate") ||
          answer.includes("present") ||
          answer.includes("explain")
        ) {
          responsePatterns.communication.push(q.userAnswer);
        }
        if (
          answer.includes("solve") ||
          answer.includes("problem") ||
          answer.includes("challenge")
        ) {
          responsePatterns.problemSolving.push(q.userAnswer);
        }
        if (
          answer.includes("team") ||
          answer.includes("collaborate") ||
          answer.includes("group")
        ) {
          responsePatterns.teamwork.push(q.userAnswer);
        }
        if (
          answer.includes("innovate") ||
          answer.includes("creative") ||
          answer.includes("new")
        ) {
          responsePatterns.innovation.push(q.userAnswer);
        }
      }
    });

    return {
      categoryResponses,
      responsePatterns,
      totalAnswered: qualitativeQuestions.filter((q) => q.answered).length,
      totalQuestions: qualitativeQuestions.length,
      responseRate:
        qualitativeQuestions.length > 0
          ? (qualitativeQuestions.filter((q) => q.answered).length /
              qualitativeQuestions.length) *
            100
          : 0,
    };
  }

  private static createRecommendationPrompt(
    assessmentData: AssessmentData,
    technicalAnalysis: any,
    qualitativeInsights: any
  ): string {
    return `
Please analyze this comprehensive skills assessment and provide personalized career recommendations.

**ASSESSMENT OVERVIEW:**
- Intent: ${assessmentData.intent}
- Technical Score: ${assessmentData.technicalScore}/${
      assessmentData.technicalTotal
    } (${assessmentData.technicalPercentage}%)
- Qualitative Questions Completed: ${assessmentData.qualitativeTotal}
- Assessment Reasoning: ${assessmentData.reasoning}
- Recommended Path: ${assessmentData.recommendedPath}

**TECHNICAL PERFORMANCE ANALYSIS:**
- Total Technical Questions: ${technicalAnalysis.totalQuestions}
- Correct Answers: ${technicalAnalysis.totalCorrect}
- Strong Areas: ${technicalAnalysis.strongAreas.join(", ") || "None identified"}
- Weak Areas: ${technicalAnalysis.weakAreas.join(", ") || "None identified"}
- Category Performance: ${JSON.stringify(
      technicalAnalysis.categoryPerformance,
      null,
      2
    )}
- Level Performance: ${JSON.stringify(
      technicalAnalysis.levelPerformance,
      null,
      2
    )}

**QUALITATIVE INSIGHTS:**
- Response Rate: ${qualitativeInsights.responseRate.toFixed(1)}%
- Leadership Indicators: ${
      qualitativeInsights.responsePatterns.leadership.length
    } responses
- Communication Indicators: ${
      qualitativeInsights.responsePatterns.communication.length
    } responses  
- Problem-Solving Indicators: ${
      qualitativeInsights.responsePatterns.problemSolving.length
    } responses
- Teamwork Indicators: ${
      qualitativeInsights.responsePatterns.teamwork.length
    } responses
- Innovation Indicators: ${
      qualitativeInsights.responsePatterns.innovation.length
    } responses

**USER CONTEXT:**
- Target Roles: ${assessmentData.targetRoles?.join(", ") || "Not specified"}
- Focus Areas: ${assessmentData.focusAreas?.join(", ") || "Not specified"}
- Profile Info: ${
      assessmentData.profileSnapshot
        ? JSON.stringify(assessmentData.profileSnapshot, null, 2)
        : "Not available"
    }

**DETAILED TECHNICAL QUESTIONS ANALYSIS:**
${assessmentData.technicalQuestions
  .map(
    (q, i) => `
${i + 1}. Category: ${q.category} | Level: ${q.level} | Result: ${
      q.isCorrect ? "CORRECT" : "INCORRECT"
    }
   Question: ${q.question.substring(0, 150)}...
   User Answer: ${q.userAnswer || "No answer"} | Correct Answer: ${
      q.correctAnswer
    }
`
  )
  .join("")}

**QUALITATIVE RESPONSES SAMPLE:**
${assessmentData.qualitativeQuestions
  .filter((q) => q.answered)
  .slice(0, 10)
  .map(
    (q, i) => `
${i + 1}. Category: ${q.category} | Level: ${q.level}
   Question: ${q.question.substring(0, 100)}...
   Response: ${q.userAnswer?.substring(0, 200)}...
`
  )
  .join("")}

**REQUIRED JSON RESPONSE FORMAT:**
{
  "summary": "2-3 paragraph comprehensive analysis of the user's performance, strengths, and areas for improvement based on both technical and qualitative data",
  "top_roles": ["Role 1", "Role 2", "Role 3", "Role 4", "Role 5"] // 5 specific role recommendations based on their performance
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2", 
    "Specific actionable recommendation 3",
    "Specific actionable recommendation 4",
    "Specific actionable recommendation 5"
  ],
  "skill_analysis": {
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "improvement_areas": ["Area 1", "Area 2", "Area 3"],
    "learning_priority": ["Priority 1", "Priority 2", "Priority 3"]
  },
  "career_insights": {
    "immediate_next_steps": ["Step 1", "Step 2", "Step 3"],
    "long_term_goals": ["Goal 1", "Goal 2", "Goal 3"],  
    "industry_trends": ["Trend 1", "Trend 2", "Trend 3"]
  }
}

Please provide specific, actionable, and encouraging recommendations based on this comprehensive assessment data.
`;
  }

  private static generateFallbackRecommendations(
    assessmentData: AssessmentData
  ): AIRecommendation {
    const percentage = assessmentData.technicalPercentage;

    return {
      summary: `Based on your assessment performance of ${percentage}% on technical questions and completion of ${
        assessmentData.qualitativeTotal
      } qualitative questions, you demonstrate ${
        percentage >= 70 ? "strong" : "developing"
      } technical capabilities with valuable insights from your behavioral responses. Your ${
        assessmentData.intent
      } intent shows clear career direction, and there are specific areas where focused development can accelerate your professional growth.`,

      top_roles:
        percentage >= 80
          ? [
              "Senior Software Engineer",
              "Technical Lead",
              "Solutions Architect",
              "Product Manager",
              "Engineering Manager",
            ]
          : percentage >= 60
          ? [
              "Software Engineer",
              "Frontend Developer",
              "Backend Developer",
              "Full Stack Developer",
              "Junior Technical Lead",
            ]
          : [
              "Junior Developer",
              "Associate Engineer",
              "Technical Intern",
              "QA Engineer",
              "Support Engineer",
            ],

      recommendations: [
        `Focus on improving technical skills in areas where you scored below 70% to reach the next career level`,
        `Leverage your qualitative responses to highlight soft skills during interviews and performance reviews`,
        `Consider pursuing certifications in your weaker technical areas to demonstrate commitment to improvement`,
        `Build a portfolio showcasing projects that combine your technical strengths with leadership qualities`,
        `Network within your target industry and seek mentorship from professionals in your desired roles`,
      ],

      skill_analysis: {
        strengths:
          percentage >= 70
            ? [
                "Strong technical foundation",
                "Problem-solving abilities",
                "Career clarity",
              ]
            : ["Willingness to learn", "Self-awareness", "Growth mindset"],
        improvement_areas: [
          "Technical depth in specific areas",
          "Hands-on project experience",
          "Industry knowledge",
        ],
        learning_priority: [
          "Core technical skills",
          "Practical application",
          "Soft skills development",
        ],
      },

      career_insights: {
        immediate_next_steps: [
          "Complete a skills gap analysis based on your target roles",
          "Start a technical project to demonstrate your capabilities",
          "Connect with professionals in your field of interest",
        ],
        long_term_goals: [
          "Achieve technical proficiency in your chosen specialization",
          "Develop leadership and communication skills",
          "Build a strong professional network in your target industry",
        ],
        industry_trends: [
          "AI and automation are reshaping technical roles",
          "Soft skills are becoming increasingly valuable",
          "Continuous learning is essential for career growth",
        ],
      },
    };
  }
}
