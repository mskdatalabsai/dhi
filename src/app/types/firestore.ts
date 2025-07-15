// types/firestore.ts

export interface FirestoreQuestion {
  id: string;
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
  caseId: string;
  caseName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionCase {
  id: string;
  caseName: string;
  caseNumber: number;
  description?: string;
  totalQuestions: number;
  questionsByLevel: {
    easy: number;
    medium: number;
    advanced: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Firestore Collections Structure:
//
// /cases/{caseId}
// - id: string
// - caseName: string
// - caseNumber: number
// - description: string
// - totalQuestions: number
// - questionsByLevel: object
// - isActive: boolean
// - createdAt: timestamp
// - updatedAt: timestamp
//
// /questions/{questionId}
// - id: string
// - functionalArea: string
// - roleTitle: string
// - questionId: string
// - question: string
// - options: object
// - correctOption: string
// - level: string
// - caseId: string (reference to case)
// - caseName: string (denormalized for easier querying)
// - createdAt: timestamp
// - updatedAt: timestamp
