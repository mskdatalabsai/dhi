// types/quiz.ts - Complete file with 5-option support

export interface QuizQuestion {
  // Technical fields
  functionalArea?: string;
  roleTitle?: string;

  // Behavioral fields
  cluster?: string;
  category?: string; // Backward compatibility
  trait?: string;
  scaleType?: "Likert" | "Multiple Choice";

  // Common fields
  questionId: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
    e?: string; // Optional 5th option for Likert scale
  };
  correctOption: string;
  level?: "easy" | "medium" | "advanced"; // Only for technical
}

export interface SurveyQuestion {
  id: number;
  type: "single_choice";
  question: string;
  options: string[]; // Can be 4 or 5 options
  required: boolean;
  correctAnswer?: string;
  level?: string;
  category?: string;
  roleTitle?: string;
  isQualitative?: boolean;
  scaleType?: "Likert" | "Multiple Choice";
}

export interface FirestoreQuestion {
  id?: string;

  // Technical fields
  functionalArea?: string;
  roleTitle?: string;

  // Behavioral fields
  cluster?: string;
  trait?: string;
  scaleType?: "Likert" | "Multiple Choice";

  // Common fields
  questionId: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
    e?: string;
  };
  correctOption: string;
  level?: "easy" | "medium" | "advanced";

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  uploadedAt?: Date;
  collection?: string;
  collectionType?: "technical" | "qualitative";
}

export interface IntentDetectionResult {
  intent: "confused" | "interested" | "grow" | "switch";
  confidence: number;
  reasoning: string;
  recommendedPath: string;
  careerInsights?: string;
  skillGaps?: string[];
  suggestedLearningPath?: string[];
}

export interface ProfileData {
  age_group: string;
  education: string;
  experience: string;
  purpose: string;
  functional_area: string;
  current_role?: string;
  target_roles?: string[];
}

export interface AssessmentMetadata {
  intent: string;
  intentConfidence: number;
  reasoning: string;
  recommendedPath: string;
  technicalCount: number;
  qualitativeCount: number;
  technicalBreakdown: {
    byLevel: {
      easy: number;
      medium: number;
      advanced: number;
    };
    byRole: string[];
  };
  qualitativeBreakdown: {
    clusters: string[];
  };
  aiOptimized: boolean;
  focusAreas?: string[];
  difficultyStrategy?: string;
  careerInsights?: string;
  skillGaps?: string[];
  suggestedLearningPath?: string[];
}

export interface DetailedQuestion {
  questionId: string;
  questionNumber: number;
  question: string;
  category: string;
  level: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: Date | null;
  wasChanged: boolean;
  isQualitative?: boolean;
}
