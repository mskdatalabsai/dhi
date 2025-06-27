// types/quiz.ts

// Type for the JSON data structure
export interface QuizQuestion {
  functionalArea: string;
  roleTitle: string;
  questionId: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctOption: string;
  level: "easy" | "medium" | "advanced";
}

// Type for your existing survey structure
export interface SurveyQuestion {
  id: number;
  type: "multiple_choice" | "single_choice" | "text" | "rating";
  question: string;
  options?: string[];
  scale?: number;
  placeholder?: string;
  required: boolean;
  // Additional fields for quiz functionality
  correctAnswer?: string;
  level?: "easy" | "medium" | "advanced";
  category?: string;
  roleTitle?: string;
}
