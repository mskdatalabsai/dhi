// types/firestore.ts - Complete file with 5-option support

export interface FirestoreQuestion {
  id?: string;

  // Technical fields
  functionalArea?: string;
  roleTitle?: string;

  // Behavioral fields (your format)
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
    e?: string; // Optional 5th option for Likert scale
  };
  correctOption: string;
  level?: "easy" | "Medium" | "Hard"; // Only for technical
  caseName?: string;

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  uploadedAt?: Date;
  uploadedBy?: string;
  batchId?: string;
  collection?: string;
  collectionType?: "technical" | "qualitative";

  // Old fields for backward compatibility
  category?: string;
  caseId?: string;
}
export interface QuestionCase {
  id: string;
  caseNumber: number;
  caseName: string;
  description?: string;
  questions: string[]; // Array of question IDs
  createdAt?: Date;
  updatedAt?: Date;
  questionsByLevel?: object;
  totalQuestions?: number;
  isActive?: boolean;
}
