// api/questions/balanced/route.ts - Get balanced questions by difficulty
import { NextRequest, NextResponse } from "next/server";
import adminDb from "../../../lib/firebase/admin";
import { FirestoreQuestion } from "../../../types/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("caseId");
    const easyCount = parseInt(searchParams.get("easy") || "2");
    const mediumCount = parseInt(searchParams.get("medium") || "2");
    const advancedCount = parseInt(searchParams.get("advanced") || "1");

    if (!caseId) {
      return NextResponse.json(
        { error: "Case ID is required" },
        { status: 400 }
      );
    }

    console.log(
      `Fetching balanced questions for ${caseId}: ${easyCount} easy, ${mediumCount} medium, ${advancedCount} advanced`
    );

    // Fetch questions by each difficulty level
    const [easySnapshot, mediumSnapshot, advancedSnapshot] = await Promise.all([
      adminDb
        .collection("questions")
        .where("caseId", "==", caseId)
        .where("level", "==", "easy")
        .get(),
      adminDb
        .collection("questions")
        .where("caseId", "==", caseId)
        .where("level", "==", "medium")
        .get(),
      adminDb
        .collection("questions")
        .where("caseId", "==", caseId)
        .where("level", "==", "advanced")
        .get(),
    ]);

    const easyQuestions: FirestoreQuestion[] = [];
    const mediumQuestions: FirestoreQuestion[] = [];
    const advancedQuestions: FirestoreQuestion[] = [];

    easySnapshot.forEach((doc) => {
      const data = doc.data();
      easyQuestions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : new Date(data.updatedAt),
      } as FirestoreQuestion);
    });

    mediumSnapshot.forEach((doc) => {
      const data = doc.data();
      mediumQuestions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : new Date(data.updatedAt),
      } as FirestoreQuestion);
    });

    advancedSnapshot.forEach((doc) => {
      const data = doc.data();
      advancedQuestions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : new Date(data.updatedAt),
      } as FirestoreQuestion);
    });

    console.log(
      `Found: ${easyQuestions.length} easy, ${mediumQuestions.length} medium, ${advancedQuestions.length} advanced`
    );

    // Randomly select from each difficulty level
    const selectedEasy = getRandomQuestions(easyQuestions, easyCount);
    const selectedMedium = getRandomQuestions(mediumQuestions, mediumCount);
    const selectedAdvanced = getRandomQuestions(
      advancedQuestions,
      advancedCount
    );

    const selectedQuestions = [
      ...selectedEasy,
      ...selectedMedium,
      ...selectedAdvanced,
    ];

    // Shuffle the final selection
    const shuffledQuestions = getRandomQuestions(
      selectedQuestions,
      selectedQuestions.length
    );

    const breakdown = {
      easy: selectedEasy.length,
      medium: selectedMedium.length,
      advanced: selectedAdvanced.length,
      total: shuffledQuestions.length,
    };

    console.log(
      `Selected: ${breakdown.easy} easy, ${breakdown.medium} medium, ${breakdown.advanced} advanced (${breakdown.total} total)`
    );

    return NextResponse.json({
      questions: shuffledQuestions,
      breakdown,
      total: shuffledQuestions.length,
    });
  } catch (error) {
    console.error("Error fetching balanced questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch balanced questions" },
      { status: 500 }
    );
  }
}

// Helper function to randomly select questions
function getRandomQuestions<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}
