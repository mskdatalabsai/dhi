/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/survey/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import adminDb from "../../lib/firebase/admin";
import { firestoreDb } from "../../lib/firebase/db-service";
import { Session } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const surveyData = await request.json();

    const profileSnapshot = await firestoreDb.profiles.getByUserId(
      (session.user as any).id
    );

    // Enhanced performance calculations - TECHNICAL QUESTIONS ONLY FOR SCORING
    const performanceByLevel: any = {};
    const performanceByCategory: any = {};
    const qualitativeAnalysis: any = {};

    if (surveyData.questions && Array.isArray(surveyData.questions)) {
      // Separate technical and qualitative questions
      const technicalQuestions = surveyData.questions.filter(
        (q: any) => !q.isQualitative && q.countsTowardScore
      );
      const qualitativeQuestions = surveyData.questions.filter(
        (q: any) => q.isQualitative
      );

      console.log(
        `Processing ${technicalQuestions.length} technical and ${qualitativeQuestions.length} qualitative questions`
      );

      // Calculate performance by difficulty level - TECHNICAL ONLY
      ["easy", "medium", "advanced"].forEach((level) => {
        const levelQuestions = technicalQuestions.filter(
          (q: any) => q.level === level
        );
        const correctCount = levelQuestions.filter(
          (q: any) => q.isCorrect
        ).length;

        performanceByLevel[level] = {
          total: levelQuestions.length,
          correct: correctCount,
          percentage:
            levelQuestions.length > 0
              ? Math.round((correctCount / levelQuestions.length) * 100)
              : 0,
          type: "technical_scored",
        };
      });

      // Calculate performance by category - TECHNICAL ONLY
      const technicalCategories = new Set(
        technicalQuestions.map((q: any) => q.category)
      );
      const categories = Array.from(technicalCategories).filter(
        (c): c is string => typeof c === "string"
      );

      categories.forEach((category) => {
        const categoryQuestions = technicalQuestions.filter(
          (q: any) => q.category === category
        );
        const correctCount = categoryQuestions.filter(
          (q: any) => q.isCorrect
        ).length;

        performanceByCategory[category] = {
          total: categoryQuestions.length,
          correct: correctCount,
          percentage:
            categoryQuestions.length > 0
              ? Math.round((correctCount / categoryQuestions.length) * 100)
              : 0,
          type: "technical_scored",
        };
      });

      // Qualitative analysis breakdown - FOR ANALYSIS ONLY
      const qualitativeCategories = new Set(
        qualitativeQuestions.map((q: any) => q.category)
      );
      const qualCategories = Array.from(qualitativeCategories).filter(
        (c): c is string => typeof c === "string"
      );

      qualCategories.forEach((category) => {
        const categoryQuestions = qualitativeQuestions.filter(
          (q: any) => q.category === category
        );

        qualitativeAnalysis[category] = {
          total: categoryQuestions.length,
          responses: categoryQuestions.map((q: any) => ({
            questionId: q.questionId,
            question: q.question,
            userAnswer: q.userAnswer,
            answered: !!q.userAnswer,
          })),
          responseRate:
            categoryQuestions.length > 0
              ? Math.round(
                  (categoryQuestions.filter((q: any) => !!q.userAnswer).length /
                    categoryQuestions.length) *
                    100
                )
              : 0,
          type: "qualitative_analysis",
        };
      });

      // Overall qualitative summary
      const totalQualitativeAnswered = qualitativeQuestions.filter(
        (q: { userAnswer: any }) => !!q.userAnswer
      ).length;
      qualitativeAnalysis._summary = {
        totalQuestions: qualitativeQuestions.length,
        totalAnswered: totalQualitativeAnswered,
        overallResponseRate:
          qualitativeQuestions.length > 0
            ? Math.round(
                (totalQualitativeAnswered / qualitativeQuestions.length) * 100
              )
            : 0,
        categories: qualCategories.length,
        type: "qualitative_summary",
      };
    }

    // Enhanced survey result with updated scoring logic
    const surveyResult = {
      // Basic user identification
      userId: (session.user as any).id,
      email: session.user.email,
      userName: session.user.name || "Unknown",
      profileId: profileSnapshot?.id || null,

      // Survey metadata
      surveyId: `survey_${Date.now()}`,
      surveyVersion: "v2.1", // Updated for new scoring system
      surveyType: "intent_based_technical_assessment",

      // Timing data
      startedAt: surveyData.startedAt || new Date(),
      completedAt: new Date(),
      submittedAt: new Date(),
      totalTimeUsed: surveyData.totalTimeUsed || 0,

      // Core performance metrics - UPDATED FOR TECHNICAL-ONLY SCORING
      totalQuestions: surveyData.totalQuestions, // All questions
      technicalQuestionsTotal: surveyData.technicalQuestionsTotal || 0, // Technical questions only
      qualitativeQuestionsTotal: surveyData.qualitativeQuestionsTotal || 0, // Qualitative questions only

      questionsAttempted:
        surveyData.questionsAttempted || surveyData.totalQuestions,
      correctAnswers: surveyData.score, // Only from technical questions
      incorrectAnswers:
        (surveyData.technicalQuestionsTotal || 0) - surveyData.score,
      skippedQuestions: surveyData.skippedQuestions || 0,

      score: surveyData.score, // Technical score only
      percentage: surveyData.percentage, // Percentage based on technical questions only

      // Scoring methodology (NEW)
      scoringMethod: surveyData.scoringMethod || "technical_only",
      scoredQuestionsCount: surveyData.scoredQuestionsCount || 0,
      analysisOnlyQuestionsCount: surveyData.analysisOnlyQuestionsCount || 0,

      // Enhanced performance breakdowns
      performanceByLevel, // Technical questions only
      performanceByCategory, // Technical questions only
      qualitativeAnalysis, // Qualitative questions analysis (NEW)

      // Intent-based assessment data
      assessmentType: surveyData.assessmentType || "intent-based",
      intent: surveyData.intent,
      intentConfidence: surveyData.intentConfidence || 0,
      reasoning: surveyData.reasoning,
      recommendedPath: surveyData.recommendedPath,

      // Question distribution data - UPDATED
      technicalQuestions: surveyData.technicalQuestions || 0,
      qualitativeQuestions: surveyData.qualitativeQuestions || 0,
      questionsByLevel: surveyData.questionsByLevel || {
        easy: 0,
        medium: 0,
        advanced: 0,
      },
      qualitativeBreakdown: surveyData.qualitativeBreakdown || {
        easy: 0,
        medium: 0,
        advanced: 0,
      },

      // Career guidance data
      targetRoles: surveyData.targetRoles || [],
      qualitativeClusters: surveyData.qualitativeClusters || [],
      careerInsights: surveyData.careerInsights,
      skillGaps: surveyData.skillGaps || [],
      suggestedLearningPath: surveyData.suggestedLearningPath || [],
      focusAreas: surveyData.focusAreas || [],
      aiOptimized: surveyData.aiOptimized || false,

      // Detailed question data for analytics
      questions: surveyData.questions || [],

      // User profile snapshot at time of assessment
      profileSnapshot: profileSnapshot
        ? {
            age_group: profileSnapshot.age_group,
            education: profileSnapshot.education,
            experience: profileSnapshot.experience,
            purpose: profileSnapshot.purpose,
            functional_area: profileSnapshot.functional_area,
            roles: profileSnapshot.roles,
            current_role: profileSnapshot.current_role,
            target_roles: profileSnapshot.target_roles,
          }
        : null,

      // System metadata - UPDATED
      metadata: {
        userAgent: request.headers.get("user-agent") || "Unknown",
        platform: "Web",
        timezone:
          surveyData.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        version: "2.1",
        features: {
          intentBased: true,
          aiOptimized: surveyData.aiOptimized || false,
          careerGuidance: !!(
            surveyData.careerInsights || surveyData.skillGaps?.length
          ),
          technicalOnlyScoring: true, // NEW FLAG
          qualitativeAnalysis: true, // NEW FLAG
        },
      },

      // Raw interaction data
      timeSpent: surveyData.timeSpent || {},
      answers: surveyData.answers || {},

      // Analytics flags for future use - UPDATED
      isComplete: true,
      hasDetailedAnalysis: !!(
        surveyData.questions && surveyData.questions.length > 0
      ),
      hasCareerGuidance: !!(
        surveyData.careerInsights || surveyData.skillGaps?.length
      ),
      hasIntentAnalysis: !!(surveyData.intent && surveyData.reasoning),
      hasTechnicalScoring: true, // NEW
      hasQualitativeAnalysis: (surveyData.qualitativeQuestionsTotal || 0) > 0, // NEW
    };

    // Save the comprehensive survey result
    const docRef = await adminDb.collection("surveyResults").add(surveyResult);

    // Update user statistics with enhanced data
    const userRef = adminDb.collection("users").doc((session.user as any).id);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const existingSurveys = userData?.totalSurveysTaken || 0;
      const existingScores = userData?.allScores || [];

      // Only use technical percentage for score tracking
      const allScores = [...existingScores, surveyData.percentage];
      const averageScore = Math.round(
        allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length
      );
      const highestScore = Math.max(...allScores);
      const lowestScore = Math.min(...allScores);

      // Enhanced user update with new scoring fields
      await userRef.update({
        // Basic survey statistics
        totalSurveysTaken: existingSurveys + 1,
        latestSurveyId: docRef.id,
        latestSurveyScore: surveyData.score, // Technical score only
        latestSurveyPercentage: surveyData.percentage, // Technical percentage only
        lastSurveyDate: new Date(),

        // Score analytics (technical only)
        averageScore,
        highestScore,
        lowestScore,
        allScores,

        // New scoring metadata
        latestScoringMethod: "technical_only",
        latestTechnicalQuestionsCount: surveyData.technicalQuestionsTotal || 0,
        latestQualitativeQuestionsCount:
          surveyData.qualitativeQuestionsTotal || 0,

        // Intent-based data
        latestIntent: surveyData.intent,
        latestRecommendedPath: surveyData.recommendedPath,
        hasCareerGuidance: !!(
          surveyData.careerInsights || surveyData.skillGaps?.length
        ),
        aiOptimizedAssessment: surveyData.aiOptimized || false,

        // Survey completion tracking
        hasTakenSurvey: true,
        surveyCompletedAt: new Date(),

        // System updates
        updatedAt: new Date(),
      });
    } else {
      // Create new user record with updated scoring fields
      await userRef.set({
        userId: (session.user as any).id,
        email: session.user.email,
        name: session.user.name,

        // Survey statistics
        totalSurveysTaken: 1,
        latestSurveyId: docRef.id,
        latestSurveyScore: surveyData.score,
        latestSurveyPercentage: surveyData.percentage,
        lastSurveyDate: new Date(),

        // Score analytics (technical only)
        averageScore: surveyData.percentage,
        highestScore: surveyData.percentage,
        lowestScore: surveyData.percentage,
        allScores: [surveyData.percentage],

        // New scoring metadata
        latestScoringMethod: "technical_only",
        latestTechnicalQuestionsCount: surveyData.technicalQuestionsTotal || 0,
        latestQualitativeQuestionsCount:
          surveyData.qualitativeQuestionsTotal || 0,

        // Intent-based data
        latestIntent: surveyData.intent,
        latestRecommendedPath: surveyData.recommendedPath,
        hasCareerGuidance: !!(
          surveyData.careerInsights || surveyData.skillGaps?.length
        ),
        aiOptimizedAssessment: surveyData.aiOptimized || false,

        // Survey completion tracking
        hasTakenSurvey: true,
        surveyCompletedAt: new Date(),

        // System fields
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Return comprehensive success response - UPDATED
    return NextResponse.json({
      success: true,
      surveyId: docRef.id,
      message: "Survey results saved successfully",

      // Basic results - Technical only
      score: surveyData.score,
      percentage: surveyData.percentage,
      totalQuestions: surveyData.totalQuestions,
      technicalQuestionsScored: surveyData.technicalQuestionsTotal || 0,
      qualitativeQuestionsAnalyzed: surveyData.qualitativeQuestionsTotal || 0,

      // Performance breakdowns
      performanceByLevel,
      performanceByCategory,
      qualitativeAnalysis, // NEW

      // Scoring methodology info
      scoringMethod: "technical_only",
      scoringExplanation:
        "Score based on technical questions only. Qualitative questions used for career analysis.",

      // Intent-based insights
      intent: surveyData.intent,
      recommendedPath: surveyData.recommendedPath,

      // Flags for client-side logic
      hasCareerGuidance: !!(
        surveyData.careerInsights || surveyData.skillGaps?.length
      ),
      aiOptimized: surveyData.aiOptimized || false,

      // Redirect instruction
      redirectTo: "/result",
    });
  } catch (error) {
    console.error("Error saving survey results:", error);
    return NextResponse.json(
      {
        error: "Failed to save survey results",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const detailed = searchParams.get("detailed") === "true";

    // TEMPORARY FIX: Query without orderBy to avoid index requirement
    const surveysRef = adminDb.collection("surveyResults");
    const surveysSnapshot = await surveysRef
      .where("userId", "==", (session.user as any).id)
      .limit(limit * 2) // Get more results to sort manually
      .get();

    // Sort manually after fetching
    const sortedDocs = surveysSnapshot.docs.sort((a, b) => {
      const aTime =
        a.data().submittedAt?.toDate?.() || a.data().submittedAt || new Date(0);
      const bTime =
        b.data().submittedAt?.toDate?.() || b.data().submittedAt || new Date(0);
      return new Date(bTime).getTime() - new Date(aTime).getTime(); // Descending order
    });

    // Take only the requested limit after sorting
    const limitedDocs = sortedDocs.slice(0, limit);

    const surveys = limitedDocs.map((doc) => {
      const data = doc.data();

      if (detailed) {
        // Return complete survey data for detailed analysis
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate?.() || data.submittedAt,
          startedAt: data.startedAt?.toDate?.() || data.startedAt,
          completedAt: data.completedAt?.toDate?.() || data.completedAt,
          surveyCompletedAt:
            data.surveyCompletedAt?.toDate?.() || data.surveyCompletedAt,
        };
      } else {
        // Return summary data for quick checks
        return {
          id: doc.id,
          surveyId: data.surveyId,
          score: data.score,
          totalQuestions: data.totalQuestions,
          technicalQuestionsTotal: data.technicalQuestionsTotal,
          qualitativeQuestionsTotal: data.qualitativeQuestionsTotal,
          percentage: data.percentage,
          totalTimeUsed: data.totalTimeUsed,
          submittedAt: data.submittedAt?.toDate?.() || data.submittedAt,
          performanceByLevel: data.performanceByLevel,
          questionsAttempted: data.questionsAttempted,
          intent: data.intent,
          recommendedPath: data.recommendedPath,
          aiOptimized: data.aiOptimized,
          hasCareerGuidance: data.hasCareerGuidance,
          scoringMethod: data.scoringMethod,
        };
      }
    });

    // Additional response metadata for client-side logic
    const hasAnySurvey = surveys.length > 0;
    const latestSurvey = surveys[0];

    return NextResponse.json({
      surveys,
      total: surveys.length,
      hasAnySurvey,
      latestSurvey: latestSurvey || null,

      // User completion status
      user: {
        hasTakenSurvey: hasAnySurvey,
        lastSurveyDate: latestSurvey?.submittedAt || null,
        latestScore: latestSurvey?.score || 0,
        latestPercentage: latestSurvey?.percentage || 0,
        latestIntent: latestSurvey?.intent || null,
        latestScoringMethod: latestSurvey?.scoringMethod || "technical_only",
        technicalQuestionsCount: latestSurvey?.technicalQuestionsTotal || 0,
        qualitativeQuestionsCount: latestSurvey?.qualitativeQuestionsTotal || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching survey results:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch survey results",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
