/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/getLatestResult/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import adminDb from "../../lib/firebase/admin";
import { Session } from "next-auth";
import { OpenAIRecommendationService } from "../../lib/openai/recommendationService";

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

    // FIXED: Generate GPT recommendations using OpenAI
    let gptResult = null;
    try {
      console.log("🤖 Starting OpenAI recommendation generation...");

      // Prepare assessment data for OpenAI analysis
      const assessmentData = {
        // Basic performance metrics
        technicalScore: submissionData.score || 0,
        technicalTotal:
          submissionData.technicalQuestionsTotal ||
          submissionData.technicalQuestions ||
          0,
        technicalPercentage: submissionData.percentage || 0,
        qualitativeTotal:
          submissionData.qualitativeQuestionsTotal ||
          submissionData.qualitativeQuestions ||
          0,

        // Intent and context
        intent: submissionData.intent || "unknown",
        reasoning: submissionData.reasoning || "",
        recommendedPath: submissionData.recommendedPath || "",

        // Question details
        technicalQuestions: (submissionData.questions || [])
          .filter((q: any) => !q.isQualitative && q.countsTowardScore)
          .map((q: any) => ({
            questionId: q.questionId,
            question: q.question,
            category: q.category || "General",
            level: q.level || "medium",
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.isCorrect,
            timeSpent: q.timeSpent || 0,
          })),

        qualitativeQuestions: (submissionData.questions || [])
          .filter((q: any) => q.isQualitative)
          .map((q: any) => ({
            questionId: q.questionId,
            question: q.question,
            category: q.category || "General",
            level: q.level || "medium",
            userAnswer: q.userAnswer,
            timeSpent: q.timeSpent || 0,
            answered: !!q.userAnswer,
          })),

        // User context
        profileSnapshot: submissionData.profileSnapshot,
        targetRoles: submissionData.targetRoles || [],
        focusAreas: submissionData.focusAreas || [],
      };

      console.log("📊 Assessment data prepared:", {
        technicalQuestions: assessmentData.technicalQuestions.length,
        qualitativeQuestions: assessmentData.qualitativeQuestions.length,
        technicalScore: `${assessmentData.technicalScore}/${assessmentData.technicalTotal}`,
        qualitativeTotal: assessmentData.qualitativeTotal,
        intent: assessmentData.intent,
      });

      // Generate recommendations using OpenAI
      gptResult = await OpenAIRecommendationService.generateRecommendations(
        assessmentData
      );

      console.log("✅ OpenAI recommendations generated successfully");

      // Save the recommendations back to the document for caching
      try {
        await doc.ref.update({
          gptResult,
          gptGeneratedAt: new Date(),
          gptVersion: "v2.0",
        });
        console.log("💾 GPT recommendations saved to database");
      } catch (saveError) {
        console.warn(
          "⚠️ Could not save GPT recommendations to database:",
          saveError
        );
      }
    } catch (gptError) {
      console.error("❌ GPT recommendation error:", gptError);

      // Check if we have cached recommendations
      if (submissionData.gptResult) {
        console.log("📁 Using cached GPT recommendations");
        gptResult = submissionData.gptResult;
      } else {
        console.log(
          "🔄 GPT recommendations failed, will continue without them"
        );
        // Don't throw error, just continue without GPT recommendations
      }
    }

    // FIXED: Better level normalization to handle case inconsistencies
    const normalizeQuestionsByLevel = (levelData: any) => {
      if (!levelData) return { easy: 0, medium: 0, advanced: 0 };

      console.log("🔍 API normalizing level data:", levelData);

      const normalized = {
        easy: levelData.easy || levelData.Easy || 0,
        medium: levelData.medium || levelData.Medium || 0,
        advanced:
          levelData.advanced ||
          levelData.Advanced ||
          levelData.Hard ||
          levelData.hard ||
          0,
      };

      console.log("✅ API normalized result:", normalized);
      return normalized;
    };

    // Transform the data to match the expected format for the result page
    const transformedResult = {
      resultId: doc.id,
      submittedAt:
        submissionData.submittedAt?.toDate?.() || submissionData.submittedAt,
      userId: submissionData.userId,

      // FIXED: Basic scores with proper technical vs total distinction
      score: submissionData.score || 0, // Technical correct answers
      totalQuestions: submissionData.totalQuestions || 0, // All questions

      // FIXED: Separate technical and qualitative totals with fallbacks
      technicalQuestionsTotal:
        submissionData.technicalQuestionsTotal ||
        submissionData.technicalQuestions ||
        0,
      qualitativeQuestionsTotal:
        submissionData.qualitativeQuestionsTotal ||
        submissionData.qualitativeQuestions ||
        0,

      percentage: submissionData.percentage || 0, // Technical percentage only
      questionsAttempted: submissionData.questionsAttempted || 0,
      skippedQuestions: submissionData.skippedQuestions || 0,
      timeUsed: submissionData.totalTimeUsed || submissionData.timeUsed || 0,

      // FIXED: Question breakdown with better level handling
      questionsByLevel: normalizeQuestionsByLevel(
        submissionData.questionsByLevel
      ),
      // FIXED: Include qualitative breakdown if available
      qualitativeBreakdown: normalizeQuestionsByLevel(
        submissionData.qualitativeBreakdown
      ),

      // Legacy fields for backward compatibility
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

      // FIXED: Detailed questions for charts with better mapping
      detailedQuestions: (submissionData.questions || []).map((q: any) => ({
        questionId: q.questionId || `q_${q.id || Math.random()}`,
        questionNumber: q.questionNumber || 0,
        question: q.question || "",
        category: q.category || "General",
        level: q.level || "medium",
        options: q.options || [],
        correctAnswer: q.correctAnswer || "",
        userAnswer: q.userAnswer || null,
        isCorrect: q.isCorrect || false,
        countsTowardScore:
          q.countsTowardScore !== undefined
            ? q.countsTowardScore
            : !q.isQualitative,
        timeSpent: q.timeSpent || 0,
        answeredAt: q.answeredAt || null,
        wasChanged: q.wasChanged || false,
        isQualitative: q.isQualitative || false,
      })),

      // Performance data for charts
      performanceByLevel: submissionData.performanceByLevel || {},
      performanceByCategory: submissionData.performanceByCategory || {},

      // FIXED: Include qualitative analysis data
      qualitativeAnalysis: submissionData.qualitativeAnalysis || {},

      // User info
      email: submissionData.email,
      userName: submissionData.userName,

      // Assessment metadata
      assessmentType: submissionData.assessmentType || "intent-based",
      surveyVersion: submissionData.surveyVersion || "2.0",

      // FIXED: Scoring metadata
      scoringMethod: submissionData.scoringMethod || "technical_only",
      scoredQuestionsCount:
        submissionData.scoredQuestionsCount ||
        submissionData.technicalQuestions ||
        0,
      analysisOnlyQuestionsCount:
        submissionData.analysisOnlyQuestionsCount ||
        submissionData.qualitativeQuestions ||
        0,

      // Timing data
      startedAt:
        submissionData.startedAt?.toDate?.() || submissionData.startedAt,
      completedAt:
        submissionData.completedAt?.toDate?.() || submissionData.completedAt,

      // Profile snapshot at time of assessment
      profileSnapshot: submissionData.profileSnapshot,

      // FIXED: GPT recommendations (now available!)
      gptResult,

      // Additional metadata
      hasCareerGuidance: submissionData.hasCareerGuidance || false,
      hasDetailedAnalysis: submissionData.hasDetailedAnalysis || false,
      hasIntentAnalysis: submissionData.hasIntentAnalysis || false,
    };

    // FIXED: Enhanced debug logging to help troubleshoot data issues
    console.log("🔍 getLatestResult Debug:", {
      userId: currentUserId,
      docId: doc.id,
      totalQuestions: transformedResult.totalQuestions,
      technicalQuestionsTotal: transformedResult.technicalQuestionsTotal,
      qualitativeQuestionsTotal: transformedResult.qualitativeQuestionsTotal,
      score: transformedResult.score,
      percentage: transformedResult.percentage,
      questionsByLevel: transformedResult.questionsByLevel,
      qualitativeBreakdown: transformedResult.qualitativeBreakdown,
      detailedQuestionsCount: transformedResult.detailedQuestions.length,
      rawQuestionsByLevel: submissionData.questionsByLevel,
      rawQualitativeBreakdown: submissionData.qualitativeBreakdown,
      scoringMethod: transformedResult.scoringMethod,
      hasGptResult: !!gptResult,

      // Check for potential issues
      issues: {
        mediumCountZero: transformedResult.questionsByLevel.medium === 0,
        scoreHigherThanTechnical:
          transformedResult.score > transformedResult.technicalQuestionsTotal,
        missingQualitativeBreakdown: !submissionData.qualitativeBreakdown,
        questionsArrayEmpty:
          !submissionData.questions || submissionData.questions.length === 0,
      },
    });

    // FIXED: Issue detection and warnings
    const issues = [];
    if (
      transformedResult.questionsByLevel.medium === 0 &&
      submissionData.questions
    ) {
      const mediumCount = submissionData.questions.filter(
        (q: any) => !q.isQualitative && q.level?.toLowerCase() === "medium"
      ).length;
      if (mediumCount > 0) {
        issues.push(
          `Medium count mismatch: calculated=${mediumCount}, stored=0`
        );
      }
    }

    if (transformedResult.score > transformedResult.technicalQuestionsTotal) {
      issues.push(
        `Score (${transformedResult.score}) > Technical Questions (${transformedResult.technicalQuestionsTotal})`
      );
    }

    if (issues.length > 0) {
      console.warn("🚨 API Issues detected:", issues);
    }

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
