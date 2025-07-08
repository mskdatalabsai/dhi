/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/admin/stats/route.ts
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

    // Get user statistics
    const usersSnapshot = await adminDb.collection("users").get();
    const totalUsers = usersSnapshot.size;

    // Get users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsersSnapshot = await adminDb
      .collection("users")
      .where("createdAt", ">=", thirtyDaysAgo)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const recentUsers = recentUsersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }));

    // Get users created in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newUsersThisWeek = await adminDb
      .collection("users")
      .where("createdAt", ">=", oneWeekAgo)
      .get();

    // Get survey statistics
    const surveysSnapshot = await adminDb.collection("surveyResults").get();
    const totalSurveys = surveysSnapshot.size;

    // Calculate average score and completion rate
    let totalScore = 0;
    let completedSurveys = 0;

    surveysSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.percentage) {
        totalScore += data.percentage;
      }
      if (data.questionsAttempted === data.totalQuestions) {
        completedSurveys++;
      }
    });

    const averageSurveyScore =
      totalSurveys > 0 ? Math.round(totalScore / totalSurveys) : 0;
    const surveyCompletionRate =
      totalSurveys > 0
        ? Math.round((completedSurveys / totalSurveys) * 100)
        : 0;

    // Get profile statistics
    const profilesSnapshot = await adminDb.collection("profiles").get();
    const totalProfiles = profilesSnapshot.size;

    // Count users by role
    let adminCount = 0;
    let regularUserCount = 0;

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.role === "admin") {
        adminCount++;
      } else {
        regularUserCount++;
      }
    });

    // Get recent survey submissions
    const recentSurveysSnapshot = await adminDb
      .collection("surveyResults")
      .orderBy("submittedAt", "desc")
      .limit(5)
      .get();

    const recentSurveys = recentSurveysSnapshot.docs.map((doc) => ({
      id: doc.id,
      userEmail: doc.data().email,
      userName: doc.data().userName,
      score: doc.data().score,
      percentage: doc.data().percentage,
      submittedAt: doc.data().submittedAt?.toDate?.() || doc.data().submittedAt,
    }));

    // Calculate profile completion rate
    const profileCompletionRate =
      totalUsers > 0 ? Math.round((totalProfiles / totalUsers) * 100) : 0;

    const stats = {
      stats: {
        totalUsers: {
          value: totalUsers,
          change: `+${newUsersThisWeek.size}`,
          label: "Total Users",
        },
        activeProfiles: {
          value: totalProfiles,
          change: `${profileCompletionRate}%`,
          label: "Profile Completion Rate",
        },
        surveyResponses: {
          value: totalSurveys,
          change: `${averageSurveyScore}%`,
          label: "Avg Score",
        },
        completionRate: {
          value: `${surveyCompletionRate}%`,
          change: "+5%",
          label: "Survey Completion Rate",
        },
      },
      recentUsers,
      recentSurveys,
      userBreakdown: {
        admins: adminCount,
        regularUsers: regularUserCount,
        newThisWeek: newUsersThisWeek.size,
      },
      surveyStats: {
        totalSurveys,
        averageScore: averageSurveyScore,
        completionRate: surveyCompletionRate,
        completedSurveys,
      },
      profileStats: {
        totalProfiles,
        completionRate: profileCompletionRate,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
