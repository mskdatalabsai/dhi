// utils/transformQuestions.ts
import { QuizQuestion, SurveyQuestion } from "../types/quiz";

/**
 * Transform quiz questions from JSON format to survey format
 */
export function transformQuizToSurvey(
  quizQuestions: QuizQuestion[]
): SurveyQuestion[] {
  return quizQuestions.map((quiz, index) => {
    // Convert options object to array format
    const optionsArray = [
      quiz.options.a,
      quiz.options.b,
      quiz.options.c,
      quiz.options.d,
    ];

    return {
      id: index + 1, // or use a unique ID based on questionId
      type: "single_choice", // All quiz questions are single choice
      question: quiz.question,
      options: optionsArray,
      required: true, // You can adjust this based on your needs
      correctAnswer: quiz.correctOption,
      level: quiz.level,
      category: quiz.functionalArea,
      roleTitle: quiz.roleTitle,
    };
  });
}

/**
 * Group questions by difficulty level
 */
export function groupQuestionsByLevel(questions: SurveyQuestion[]) {
  return questions.reduce((acc, question) => {
    const level = question.level || "unclassified";
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(question);
    return acc;
  }, {} as Record<string, SurveyQuestion[]>);
}

/**
 * Filter questions by role or functional area
 */
export function filterQuestionsByRole(
  questions: SurveyQuestion[],
  roleTitle?: string,
  functionalArea?: string
): SurveyQuestion[] {
  return questions.filter((q) => {
    if (roleTitle && q.roleTitle !== roleTitle) return false;
    if (functionalArea && q.category !== functionalArea) return false;
    return true;
  });
}

/**
 * Get a random selection of questions
 */
export function getRandomQuestions(
  questions: SurveyQuestion[],
  count: number,
  options?: {
    easyCount?: number;
    mediumCount?: number;
    advancedCount?: number;
  }
): SurveyQuestion[] {
  if (options) {
    const grouped = groupQuestionsByLevel(questions);
    const selected: SurveyQuestion[] = [];

    if (options.easyCount && grouped.easy) {
      selected.push(...shuffleArray(grouped.easy).slice(0, options.easyCount));
    }
    if (options.mediumCount && grouped.medium) {
      selected.push(
        ...shuffleArray(grouped.medium).slice(0, options.mediumCount)
      );
    }
    if (options.advancedCount && grouped.advanced) {
      selected.push(
        ...shuffleArray(grouped.advanced).slice(0, options.advancedCount)
      );
    }

    return selected;
  }

  return shuffleArray(questions).slice(0, count);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
