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

    const performanceByLevel: any = {};
    const performanceByCategory: any = {};

    if (surveyData.questions && Array.isArray(surveyData.questions)) {
      ["easy", "medium", "advanced"].forEach((level) => {
        const levelQuestions = surveyData.questions.filter(
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
        };
      });

      const rawCategories = new Set(
        surveyData.questions.map((q: any) => q.category)
      );
      const categories = Array.from(rawCategories).filter(
        (c): c is string => typeof c === "string"
      );

      categories.forEach((category) => {
        const categoryQuestions = surveyData.questions.filter(
          (q: any) => q.category === category
        );
        const correctCount = categoryQuestions.filter(
          (q: any) => q.isCorrect
        ).length;

        performanceByCategory[category] = {
          total: categoryQuestions.length,
          correct: correctCount,
          percentage: Math.round(
            (correctCount / categoryQuestions.length) * 100
          ),
        };
      });
    }

    const surveyResult = {
      userId: (session.user as any).id,
      email: session.user.email,
      userName: session.user.name || "Unknown",
      profileId: profileSnapshot?.id || null,

      surveyId: `survey_${Date.now()}`,
      surveyVersion: "v1.0",
      surveyType: "technical_assessment",

      startedAt: surveyData.startedAt || new Date(),
      completedAt: new Date(),
      totalTimeUsed: surveyData.totalTimeUsed || 0,

      totalQuestions: surveyData.totalQuestions,
      questionsAttempted:
        surveyData.questionsAttempted || surveyData.totalQuestions,
      correctAnswers: surveyData.score,
      incorrectAnswers: surveyData.totalQuestions - surveyData.score,
      skippedQuestions: surveyData.skippedQuestions || 0,
      score: surveyData.score,
      percentage: surveyData.percentage,

      performanceByLevel,
      performanceByCategory,

      questions: surveyData.questions || [],

      profileSnapshot: profileSnapshot
        ? {
            age_group: profileSnapshot.age_group,
            education: profileSnapshot.education,
            experience: profileSnapshot.experience,
            purpose: profileSnapshot.purpose,
            functional_area: profileSnapshot.functional_area,
            roles: profileSnapshot.roles,
          }
        : null,

      metadata: {
        userAgent: request.headers.get("user-agent") || "Unknown",
        platform: "Web",
        timezone:
          surveyData.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      },

      timeSpent: surveyData.timeSpent || {},
      answers: surveyData.answers || {},

      submittedAt: new Date(),
    };

    const docRef = await adminDb.collection("surveyResults").add(surveyResult);

    const userRef = adminDb.collection("users").doc((session.user as any).id);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const existingSurveys = userData?.totalSurveysTaken || 0;
      const existingScores = userData?.allScores || [];

      const allScores = [...existingScores, surveyData.percentage];
      const averageScore = Math.round(
        allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length
      );
      const highestScore = Math.max(...allScores);
      const lowestScore = Math.min(...allScores);

      await userRef.update({
        totalSurveysTaken: existingSurveys + 1,
        latestSurveyId: docRef.id,
        latestSurveyScore: surveyData.score,
        latestSurveyPercentage: surveyData.percentage,
        lastSurveyDate: new Date(),
        averageScore,
        highestScore,
        lowestScore,
        allScores,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      surveyId: docRef.id,
      message: "Survey results saved successfully",
      score: surveyData.score,
      percentage: surveyData.percentage,
      performanceByLevel,
      performanceByCategory,
    });
  } catch (error) {
    console.error("Error saving survey results:", error);
    return NextResponse.json(
      { error: "Failed to save survey results" },
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

    const surveysRef = adminDb.collection("surveyResults");
    const surveysSnapshot = await surveysRef
      .where("userId", "==", (session.user as any).id)
      .orderBy("submittedAt", "desc")
      .limit(limit)
      .get();

    const surveys = surveysSnapshot.docs.map((doc) => {
      const data = doc.data();

      if (detailed) {
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate?.() || data.submittedAt,
          startedAt: data.startedAt?.toDate?.() || data.startedAt,
          completedAt: data.completedAt?.toDate?.() || data.completedAt,
        };
      } else {
        return {
          id: doc.id,
          surveyId: data.surveyId,
          score: data.score,
          totalQuestions: data.totalQuestions,
          percentage: data.percentage,
          totalTimeUsed: data.totalTimeUsed,
          submittedAt: data.submittedAt?.toDate?.() || data.submittedAt,
          performanceByLevel: data.performanceByLevel,
          questionsAttempted: data.questionsAttempted,
        };
      }
    });

    return NextResponse.json({
      surveys,
      total: surveys.length,
    });
  } catch (error) {
    console.error("Error fetching survey results:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey results" },
      { status: 500 }
    );
  }
}
