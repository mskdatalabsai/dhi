/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/surveys/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import adminDb from "../../../lib/firebase/admin";
import { Session } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session;

    // Check if user is admin
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = adminDb
      .collection("surveyResults")
      .orderBy("submittedAt", "desc");

    // Filter by userId if provided
    if (userId) {
      query = query.where("userId", "==", userId);
    }

    // Filter by date range if provided
    if (startDate) {
      query = query.where("submittedAt", ">=", new Date(startDate));
    }
    if (endDate) {
      query = query.where("submittedAt", "<=", new Date(endDate));
    }

    const surveysSnapshot = await query.limit(limit).get();

    const surveys = surveysSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userEmail: data.email,
        userName: data.userName,
        score: data.score,
        percentage: data.percentage,
        totalQuestions: data.totalQuestions,
        questionsAttempted: data.questionsAttempted,
        correctAnswers: data.correctAnswers,
        totalTimeUsed: data.totalTimeUsed,
        performanceByLevel: data.performanceByLevel,
        performanceByCategory: data.performanceByCategory,
        profileSnapshot: data.profileSnapshot,
        submittedAt: data.submittedAt?.toDate?.() || data.submittedAt,
        completedAt: data.completedAt?.toDate?.() || data.completedAt,
      };
    });

    // Get total count
    const totalSnapshot = await adminDb
      .collection("surveyResults")
      .count()
      .get();
    const total = totalSnapshot.data().count;

    // Calculate summary statistics
    const stats = {
      totalSurveys: total,
      averageScore:
        surveys.length > 0
          ? Math.round(
              surveys.reduce((sum, s) => sum + s.percentage, 0) / surveys.length
            )
          : 0,
      averageTimeUsed:
        surveys.length > 0
          ? Math.round(
              surveys.reduce((sum, s) => sum + (s.totalTimeUsed || 0), 0) /
                surveys.length
            )
          : 0,
      completionRate:
        surveys.length > 0
          ? Math.round(
              (surveys.filter((s) => s.questionsAttempted === s.totalQuestions)
                .length /
                surveys.length) *
                100
            )
          : 0,
    };

    return NextResponse.json({
      surveys,
      total,
      stats,
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Failed to fetch surveys" },
      { status: 500 }
    );
  }
}

// Get survey details by ID
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session;

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { surveyId } = await request.json();

    if (!surveyId) {
      return NextResponse.json(
        { error: "Survey ID required" },
        { status: 400 }
      );
    }

    const surveyDoc = await adminDb
      .collection("surveyResults")
      .doc(surveyId)
      .get();

    if (!surveyDoc.exists) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    const data = surveyDoc.data();

    return NextResponse.json({
      survey: {
        id: surveyDoc.id,
        ...data,
        submittedAt: data?.submittedAt?.toDate?.() || data?.submittedAt,
        completedAt: data?.completedAt?.toDate?.() || data?.completedAt,
        startedAt: data?.startedAt?.toDate?.() || data?.startedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching survey details:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey details" },
      { status: 500 }
    );
  }
}
