// pages/api/getLatestResult.ts - Enhanced version with GPT integration
import type { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { generateRecommendation } from "../lib/generateRecommendation";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.query;
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const latestSnap = await db
      .collection("survey_submissions")
      .where("userId", "==", userId)
      .orderBy("startedAt", "desc")
      .limit(1)
      .get();

    if (latestSnap.empty) {
      return res.status(404).json({ error: "No results found" });
    }

    const doc = latestSnap.docs[0];
    const submissionData = doc.data();

    // Generate GPT recommendations
    let gptResult = null;
    try {
      gptResult = await generateRecommendation(submissionData);
    } catch (gptError) {
      console.error("GPT recommendation error:", gptError);
      // Continue without GPT recommendations
    }

    return res.status(200).json({
      resultId: doc.id,
      submittedAt: submissionData.startedAt,
      userId: submissionData.userId,

      // Basic scores
      score: submissionData.score,
      totalQuestions: submissionData.totalQuestions,
      percentage: submissionData.percentage,
      questionsAttempted: submissionData.questionsAttempted,
      skippedQuestions: submissionData.skippedQuestions,
      timeUsed: submissionData.totalTimeUsed,

      // Question breakdown
      questionsByLevel: submissionData.questionsByLevel,
      technicalQuestions: submissionData.technicalQuestions,
      qualitativeQuestions: submissionData.qualitativeQuestions,

      // Intent data
      intent: submissionData.intent,
      intentConfidence: submissionData.intentConfidence,
      reasoning: submissionData.reasoning,
      recommendedPath: submissionData.recommendedPath,

      // Career insights
      targetRoles: submissionData.targetRoles,
      qualitativeClusters: submissionData.qualitativeClusters,
      careerInsights: submissionData.careerInsights,
      skillGaps: submissionData.skillGaps,
      suggestedLearningPath: submissionData.suggestedLearningPath,
      focusAreas: submissionData.focusAreas,
      aiOptimized: submissionData.aiOptimized,

      // Detailed questions for charts
      detailedQuestions: submissionData.questions || [],

      // GPT recommendations
      gptResult,
    });
  } catch (error) {
    console.error("Error in /getLatestResult:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
