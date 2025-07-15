/* eslint-disable @typescript-eslint/no-explicit-any */
// services/questionService.ts - Simplified for hardcoded case
import { FirestoreQuestion } from "../types/firestore";
import { SurveyQuestion } from "../types/quiz";

// 🔧 CONFIGURATION: Change this to use different case
const HARDCODED_CASE_ID = "case_3"; // Change to case_2, case_3, etc. as needed

export class QuestionService {
  /**
   * Get 60 random questions from the hardcoded case
   */
  static async getQuestionsForSurvey(): Promise<SurveyQuestion[]> {
    try {
      console.log(`Loading 60 random questions from ${HARDCODED_CASE_ID}`);

      const response = await fetch(
        `/api/questions?caseId=${HARDCODED_CASE_ID}&count=60`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch questions");
      }

      if (data.questions.length === 0) {
        throw new Error(`No questions found for ${HARDCODED_CASE_ID}`);
      }

      console.log(
        `✅ Loaded ${data.questions.length} questions from ${HARDCODED_CASE_ID}`
      );

      return this.transformFirestoreToSurvey(data.questions);
    } catch (error) {
      console.error("Error getting questions for survey:", error);
      throw error;
    }
  }

  /**
   * Get balanced 60 questions (20 easy, 25 medium, 15 advanced) from hardcoded case
   */
  static async getBalancedQuestionsForSurvey(): Promise<SurveyQuestion[]> {
    try {
      console.log(`Loading 60 balanced questions from ${HARDCODED_CASE_ID}`);

      const params = new URLSearchParams({
        caseId: HARDCODED_CASE_ID,
        easy: "2",
        medium: "2",
        advanced: "1",
      });

      const response = await fetch(`/api/questions/balanced?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch balanced questions");
      }

      if (data.questions.length === 0) {
        throw new Error(`No questions found for ${HARDCODED_CASE_ID}`);
      }

      console.log(
        `✅ Loaded ${data.questions.length} balanced questions from ${HARDCODED_CASE_ID}`
      );
      console.log(
        `Distribution: ${data.breakdown.easy} easy, ${data.breakdown.medium} medium, ${data.breakdown.advanced} advanced`
      );

      return this.transformFirestoreToSurvey(data.questions);
    } catch (error) {
      console.error("Error getting balanced questions for survey:", error);
      throw error;
    }
  }

  /**
   * Transform Firestore questions to Survey format
   */
  private static transformFirestoreToSurvey(
    firestoreQuestions: FirestoreQuestion[]
  ): SurveyQuestion[] {
    return firestoreQuestions.map((question, index) => ({
      id: index + 1,
      type: "single_choice" as const,
      question: question.question,
      options: [
        question.options.a,
        question.options.b,
        question.options.c,
        question.options.d,
      ],
      required: true,
      correctAnswer: question.correctOption,
      level: question.level,
      category: question.functionalArea,
      roleTitle: question.roleTitle,
    }));
  }

  /**
   * Get the current hardcoded case info
   */
  static getHardcodedCaseInfo(): { caseId: string; caseName: string } {
    const caseNumber = HARDCODED_CASE_ID.replace("case_", "");
    return {
      caseId: HARDCODED_CASE_ID,
      caseName: `Case ${caseNumber}`,
    };
  }
}

// Optional: Cache service for better performance
export class QuestionCacheService {
  private static cache = new Map<string, any>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getCachedQuestions(
    useBalanced: boolean = true
  ): Promise<SurveyQuestion[]> {
    const cacheKey = `questions_${HARDCODED_CASE_ID}_${
      useBalanced ? "balanced" : "random"
    }`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Using cached questions for ${HARDCODED_CASE_ID}`);
      return cached.data;
    }

    const questions = useBalanced
      ? await QuestionService.getBalancedQuestionsForSurvey()
      : await QuestionService.getQuestionsForSurvey();

    this.cache.set(cacheKey, { data: questions, timestamp: Date.now() });
    return questions;
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
