/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/admin/uploadQuestions.ts
import { db } from "../../lib/firebase/config"; // Your Firebase config
import { doc, writeBatch } from "firebase/firestore";
import { QuizQuestion } from "../../types/quiz"; // Adjust the import path as needed
import { FirestoreQuestion, QuestionCase } from "../../types/firestore";

interface UploadCase {
  caseName: string;
  caseNumber: number;
  description?: string;
  jsonData: QuizQuestion[];
}

export class QuestionUploader {
  /**
   * Upload multiple cases with their questions to Firestore
   */
  static async uploadCasesWithQuestions(cases: UploadCase[]): Promise<void> {
    try {
      console.log("Starting upload process...");

      for (const caseData of cases) {
        await this.uploadSingleCase(caseData);
        console.log(`✅ Uploaded case: ${caseData.caseName}`);
      }

      console.log("🎉 All cases uploaded successfully!");
    } catch (error) {
      console.error("❌ Error uploading cases:", error);
      throw error;
    }
  }

  /**
   * Upload a single case with its questions
   */
  static async uploadSingleCase(caseData: UploadCase): Promise<string> {
    const batch = writeBatch(db);

    // Generate case ID
    const caseId = `case_${caseData.caseNumber}`;

    // Count questions by level
    const questionsByLevel = this.countQuestionsByLevel(caseData.jsonData);

    // Create case document
    const caseDoc: QuestionCase = {
      id: caseId,
      caseName: caseData.caseName,
      caseNumber: caseData.caseNumber,
      description: caseData.description || "",
      totalQuestions: caseData.jsonData.length,
      questionsByLevel,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: [],
    };

    // Add case to batch
    const caseRef = doc(db, "cases", caseId);
    batch.set(caseRef, caseDoc);

    // Add questions to batch
    caseData.jsonData.forEach((question, index) => {
      const questionId = `${caseId}_q_${index + 1}`;
      const questionDoc: FirestoreQuestion = {
        id: questionId,
        functionalArea: question.functionalArea,
        roleTitle: question.roleTitle,
        questionId: question.questionId,
        question: question.question,
        options: question.options,
        correctOption: question.correctOption,
        // Fix level casing to match FirestoreQuestion type
        level:
          question.level === "easy"
            ? "easy"
            : question.level === "medium"
            ? "Medium"
            : question.level === "advanced"
            ? "Hard"
            : undefined,
        caseId: caseId,
        caseName: caseData.caseName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const questionRef = doc(db, "questions", questionId);
      batch.set(questionRef, questionDoc);
    });

    // Commit batch
    await batch.commit();
    return caseId;
  }

  /**
   * Count questions by difficulty level
   */
  private static countQuestionsByLevel(questions: QuizQuestion[]) {
    return questions.reduce(
      (acc, question) => {
        if (
          question.level === "easy" ||
          question.level === "medium" ||
          question.level === "advanced"
        ) {
          acc[question.level] = (acc[question.level] || 0) + 1;
        }
        return acc;
      },
      { easy: 0, medium: 0, advanced: 0 }
    );
  }

  /**
   * Helper method to upload from JSON files
   */
  static async uploadFromJSONFiles(jsonFiles: {
    [caseName: string]: QuizQuestion[];
  }): Promise<void> {
    const cases: UploadCase[] = Object.entries(jsonFiles).map(
      ([caseName, questions], index) => ({
        caseName,
        caseNumber: index + 1,
        description: `Questions for ${caseName}`,
        jsonData: questions,
      })
    );

    await this.uploadCasesWithQuestions(cases);
  }
}

// Example usage script - you can run this in a separate admin page or script
export const uploadExampleData = async () => {
  // Example: If you have 10 JSON files
  const rawJsonFiles = {
    "case 1": await import("../../../../public/questions_demo_1.json"),
    "case 2": await import("../../../../public/questions_demo_2.json"),
    "case 3": await import("../../../../public/questions_demo_3.json"),
    "case 4": await import("../../../../public/questions_demo_4.json"),
    "case 5": await import("../../../../public/questions_demo_5.json"),
    "case 6": await import("../../../../public/questions_demo_6.json"),
    "case 7": await import("../../../../public/questions_demo_7.json"),
    "case 8": await import("../../../../public/questions_demo_8.json"),
    "case 9": await import("../../../../public/questions_demo_9.json"),
    "case 10": await import("../../../../public/questions_demo_10.json"),
  };

  // Map to correct structure and types
  const jsonFiles: { [caseName: string]: QuizQuestion[] } = {};
  for (const [caseName, imported] of Object.entries(rawJsonFiles)) {
    // Map level to correct union type
    jsonFiles[caseName] = (imported.default as any[]).map((q) => ({
      ...q,
      level:
        q.level === "easy" || q.level === "medium" || q.level === "advanced"
          ? q.level
          : "easy", // fallback or handle as needed
    }));
  }

  try {
    await QuestionUploader.uploadFromJSONFiles(jsonFiles);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
