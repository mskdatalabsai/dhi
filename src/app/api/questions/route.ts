// api/questions/route.ts - Get questions by case
import { NextRequest, NextResponse } from "next/server";
import adminDb from "../../lib/firebase/admin";
import { FirestoreQuestion } from "../../types/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("caseId");
    const questionCount = parseInt(searchParams.get("count") || "5");
    const level = searchParams.get("level"); // optional filter by difficulty

    if (!caseId) {
      return NextResponse.json(
        { error: "Case ID is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching ${questionCount} questions from ${caseId}`);

    let query = adminDb.collection("questions").where("caseId", "==", caseId);

    // Add level filter if specified
    if (level && ["easy", "medium", "advanced"].includes(level)) {
      query = query.where("level", "==", level);
    }

    const snapshot = await query.get();
    const allQuestions: FirestoreQuestion[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      allQuestions.push({
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

    console.log(`Found ${allQuestions.length} total questions in ${caseId}`);

    // Randomly select questions
    const selectedQuestions = getRandomQuestions(allQuestions, questionCount);

    console.log(`Selected ${selectedQuestions.length} random questions`);

    return NextResponse.json({
      questions: selectedQuestions,
      total: allQuestions.length,
      selected: selectedQuestions.length,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// Helper function to randomly select questions
function getRandomQuestions<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}
