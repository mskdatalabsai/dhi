/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/getLatestResult/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import adminDb from "../../lib/firebase/admin";
import { Session } from "next-auth";

// Optional: Import your GPT recommendation function if you have it
// import { generateRecommendation } from '@/lib/generateRecommendation';

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const requestedUserId = searchParams.get("userId");

    // Security check: users can only access their own results
    const currentUserId = (session.user as any).id;
    if (
      requestedUserId &&
      requestedUserId !== currentUserId &&
      requestedUserId !== session.user.email
    ) {
      return NextResponse.json(
        {
          error: "Forbidden: Cannot access another user's results",
        },
        { status: 403 }
      );
    }

    // Get the latest survey result for the current user
    const surveysRef = adminDb.collection("surveyResults");
    const latestSnapshot = await surveysRef
      .where("userId", "==", currentUserId)
      .orderBy("submittedAt", "desc")
      .limit(1)
      .get();

    if (latestSnapshot.empty) {
      return NextResponse.json(
        {
          error: "No results found. Please take the assessment first.",
        },
        { status: 404 }
      );
    }

    const doc = latestSnapshot.docs[0];
    const submissionData = doc.data();

    // Generate GPT recommendations if you have the function
    let gptResult = null;
    try {
      // Uncomment if you have GPT integration
      // gptResult = await generateRecommendation(submissionData);
    } catch (gptError) {
      console.error("GPT recommendation error:", gptError);
      // Continue without GPT recommendations
    }

    // Transform the data to match the expected format for the result page
    const transformedResult = {
      resultId: doc.id,
      submittedAt:
        submissionData.submittedAt?.toDate?.() || submissionData.submittedAt,
      userId: submissionData.userId,

      // Basic scores
      score: submissionData.score || 0,
      totalQuestions: submissionData.totalQuestions || 0,
      percentage: submissionData.percentage || 0,
      questionsAttempted: submissionData.questionsAttempted || 0,
      skippedQuestions: submissionData.skippedQuestions || 0,
      timeUsed: submissionData.totalTimeUsed || 0,

      // Question breakdown
      questionsByLevel: submissionData.questionsByLevel || {
        easy: 0,
        medium: 0,
        advanced: 0,
      },
      technicalQuestions: submissionData.technicalQuestions || 0,
      qualitativeQuestions: submissionData.qualitativeQuestions || 0,

      // Intent data
      intent: submissionData.intent || "unknown",
      intentConfidence: submissionData.intentConfidence || 0,
      reasoning: submissionData.reasoning || "",
      recommendedPath: submissionData.recommendedPath || "",

      // Career insights
      targetRoles: submissionData.targetRoles || [],
      qualitativeClusters: submissionData.qualitativeClusters || [],
      careerInsights: submissionData.careerInsights || "",
      skillGaps: submissionData.skillGaps || [],
      suggestedLearningPath: submissionData.suggestedLearningPath || [],
      focusAreas: submissionData.focusAreas || [],
      aiOptimized: submissionData.aiOptimized || false,

      // Detailed questions for charts (transform to expected format)
      detailedQuestions: submissionData.questions || [],

      // Performance data for charts
      performanceByLevel: submissionData.performanceByLevel || {},
      performanceByCategory: submissionData.performanceByCategory || {},

      // User info
      email: submissionData.email,
      userName: submissionData.userName,

      // Assessment metadata
      assessmentType: submissionData.assessmentType || "intent-based",
      surveyVersion: submissionData.surveyVersion || "2.0",

      // Timing data
      startedAt:
        submissionData.startedAt?.toDate?.() || submissionData.startedAt,
      completedAt:
        submissionData.completedAt?.toDate?.() || submissionData.completedAt,

      // Profile snapshot at time of assessment
      profileSnapshot: submissionData.profileSnapshot,

      // GPT recommendations (if available)
      gptResult,

      // Additional metadata
      hasCareerGuidance: submissionData.hasCareerGuidance || false,
      hasDetailedAnalysis: submissionData.hasDetailedAnalysis || false,
      hasIntentAnalysis: submissionData.hasIntentAnalysis || false,
    };

    return NextResponse.json(transformedResult);
  } catch (error) {
    console.error("Error in /getLatestResult:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
