/* eslint-disable @typescript-eslint/no-explicit-any */
// services/questionService.ts - Complete file with 5-option support
import { FirestoreQuestion } from "../types/firestore";
import {
  SurveyQuestion,
  ProfileData,
  IntentDetectionResult,
} from "../types/quiz";

export class QuestionService {
  /**
   * Get intent-based questions for survey
   */
  static async getIntentBasedQuestions(
    profileData: ProfileData,
    options: { useAIOptimization?: boolean } = {}
  ): Promise<{
    questions: SurveyQuestion[];
    intent: IntentDetectionResult;
    metadata: any;
  }> {
    try {
      console.log("Getting intent-based questions for profile:", profileData);
      console.log(
        "AI Optimization:",
        options.useAIOptimization ? "Enabled" : "Disabled"
      );

      // Step 1: Detect intent (using OpenAI if configured)
      const intentResponse = await fetch("/api/intent/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: profileData.purpose,
          experience: profileData.experience,
          current_role: profileData.current_role || null,
          target_roles: profileData.target_roles || [],
          age_group: profileData.age_group,
          education: profileData.education,
          functional_area: profileData.functional_area,
        }),
      });

      if (!intentResponse.ok) {
        throw new Error("Failed to detect intent");
      }

      const intentData: IntentDetectionResult & {
        careerInsights?: string;
        skillGaps?: string[];
        suggestedLearningPath?: string[];
      } = await intentResponse.json();

      console.log("Detected intent:", intentData);

      // Step 2: Get questions based on intent (with optional AI optimization)
      const questionsResponse = await fetch("/api/questions/intent-based", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: intentData.intent,
          experience: profileData.experience,
          current_role: profileData.current_role,
          target_roles: profileData.target_roles,
          age_group: profileData.age_group,
          education: profileData.education,
          purpose: profileData.purpose,
          useAIOptimization: options.useAIOptimization || false,
        }),
      });

      if (!questionsResponse.ok) {
        throw new Error("Failed to fetch intent-based questions");
      }

      const questionsData = await questionsResponse.json();

      if (!questionsData.success || !questionsData.questions) {
        throw new Error("Invalid response from questions API");
      }

      console.log(
        `✅ Loaded ${questionsData.questions.length} questions for intent: ${intentData.intent}`
      );
      if (questionsData.metadata?.aiOptimized) {
        console.log("📊 Questions optimized using AI");
      }

      // Transform questions to survey format
      const surveyQuestions = this.transformFirestoreToSurvey(
        questionsData.questions
      );

      return {
        questions: surveyQuestions,
        intent: intentData,
        metadata: {
          ...questionsData.metadata,
          careerInsights: intentData.careerInsights,
          skillGaps: intentData.skillGaps,
          suggestedLearningPath: intentData.suggestedLearningPath,
        },
      };
    } catch (error) {
      console.error("Error getting intent-based questions:", error);
      throw error;
    }
  }

  /**
   * Transform Firestore questions to Survey format
   * Now supports both 4-option and 5-option questions
   */
  private static transformFirestoreToSurvey(
    firestoreQuestions: FirestoreQuestion[]
  ): SurveyQuestion[] {
    return firestoreQuestions.map((question, index) => {
      // Build options array - handles both 4 and 5 options
      const options = [
        question.options.a,
        question.options.b,
        question.options.c,
        question.options.d,
      ];

      // Add option E if it exists (for Likert scale questions)
      if (question.options.e) {
        options.push(question.options.e);
      }

      return {
        id: index + 1,
        type: "single_choice" as const,
        question: question.question,
        options: options,
        required: true,
        correctAnswer: question.correctOption,
        level: question.level,
        category: question.functionalArea || question.cluster,
        roleTitle: question.roleTitle,
        // Determine if it's a qualitative question
        isQualitative:
          question.cluster !== undefined ||
          question.collectionType === "qualitative" ||
          question.functionalArea?.includes("agility") ||
          question.functionalArea?.includes("Awareness") ||
          question.functionalArea?.includes("Collaboration") ||
          question.functionalArea?.includes("Leadership") ||
          question.functionalArea?.includes("Values") ||
          question.functionalArea?.includes("Resilience"),
        scaleType: question.scaleType,
      };
    });
  }

  /**
   * Fallback to get random questions from a specific case (for backward compatibility)
   */
  static async getQuestionsForSurvey(
    caseId: string = "case_1"
  ): Promise<SurveyQuestion[]> {
    try {
      console.log(`Loading 60 random questions from ${caseId}`);

      const response = await fetch(`/api/questions?caseId=${caseId}&count=60`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch questions");
      }

      if (data.questions.length === 0) {
        throw new Error(`No questions found for ${caseId}`);
      }

      console.log(
        `✅ Loaded ${data.questions.length} questions from ${caseId}`
      );

      return this.transformFirestoreToSurvey(data.questions);
    } catch (error) {
      console.error("Error getting questions for survey:", error);
      throw error;
    }
  }

  /**
   * Get balanced questions (for backward compatibility)
   */
  static async getBalancedQuestionsForSurvey(): Promise<SurveyQuestion[]> {
    try {
      const caseId = "case_1"; // Default case
      console.log(`Loading 60 balanced questions from ${caseId}`);

      const params = new URLSearchParams({
        caseId: caseId,
        easy: "20",
        medium: "25",
        advanced: "15",
      });

      const response = await fetch(`/api/questions/balanced?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch balanced questions");
      }

      if (data.questions.length === 0) {
        throw new Error(`No questions found for ${caseId}`);
      }

      console.log(`✅ Loaded ${data.questions.length} balanced questions`);

      return this.transformFirestoreToSurvey(data.questions);
    } catch (error) {
      console.error("Error getting balanced questions for survey:", error);
      throw error;
    }
  }

  /**
   * Get hardcoded case info (for backward compatibility)
   */
  static getHardcodedCaseInfo(): { caseId: string; caseName: string } {
    return {
      caseId: "case_1",
      caseName: "Case 1",
    };
  }

  /**
   * Cache service for better performance
   */
  static cache = new Map<string, { data: any; timestamp: number }>();
  static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getCachedIntentQuestions(profileData: ProfileData): Promise<{
    questions: SurveyQuestion[];
    intent: IntentDetectionResult;
    metadata: any;
  }> {
    const cacheKey = `intent_${JSON.stringify(profileData)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log("Using cached intent-based questions");
      return cached.data;
    }

    const result = await this.getIntentBasedQuestions(profileData, {
      useAIOptimization: true,
    });
    this.cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
