/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SuccessScreen from "../components/SuccessScreen";
import Navbar from "../components/Navbar";

interface SurveyResult {
  score: number;
  totalQuestions: number;
  technicalQuestionsTotal: number;
  qualitativeQuestionsTotal: number;
  percentage: number;
  timeUsed: number;
  questionsAttempted: number;
  skippedQuestions: number;

  questionsByLevel: {
    easy: number;
    medium: number;
    advanced: number;
  };
  qualitativeBreakdown: {
    easy: number;
    medium: number;
    advanced: number;
  };
  technicalQuestions: number;
  qualitativeQuestions: number;

  intent: string;
  intentConfidence: number;
  reasoning: string;
  recommendedPath: string;

  targetRoles: string[];
  qualitativeClusters: string[];
  careerInsights: string;
  skillGaps: string[];
  suggestedLearningPath: string[];
  focusAreas: string[];

  aiOptimized: boolean;

  questions: Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    category: string;
    level: string;
    countsTowardScore?: boolean;
    isQualitative?: boolean;
  }>;

  performanceByLevel: any;
  performanceByCategory: any;
  qualitativeAnalysis?: any;

  startedAt: string;
  submittedAt: string;

  scoringMethod?: string;
  scoredQuestionsCount?: number;
  analysisOnlyQuestionsCount?: number;
}

const ResultPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [result, setResult] = useState<SurveyResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ✅ Fix: Make isDark a proper state that can be toggled
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Initialize from localStorage if available, otherwise default to dark
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dhiti-theme");
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchSurveyResults();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // ✅ Fix: Implement proper theme toggle function with localStorage persistence
  const toggleTheme = () => {
    setIsDark((prevIsDark) => {
      const newTheme = !prevIsDark;
      if (typeof window !== "undefined") {
        localStorage.setItem("dhiti-theme", JSON.stringify(newTheme));
      }
      return newTheme;
    });
  };

  const normalizeQuestionsByLevel = (levelData: any) => {
    if (!levelData) return { easy: 0, medium: 0, advanced: 0 };

    return {
      easy: levelData.easy || levelData.Easy || 0,
      medium: levelData.medium || levelData.Medium || 0,
      advanced:
        levelData.advanced ||
        levelData.Advanced ||
        levelData.Hard ||
        levelData.hard ||
        0,
    };
  };

  const fetchSurveyResults = async () => {
    if (!session?.user) {
      setError("User session not found");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/survey?limit=1&detailed=true");

      if (!response.ok) {
        if (response.status === 404) {
          alert("Please complete the assessment first.");
          router.push("/survey");
          return;
        }
        throw new Error(`Failed to fetch results: ${response.status}`);
      }

      const data = await response.json();

      if (!data.surveys || data.surveys.length === 0) {
        alert("Please complete the assessment first.");
        router.push("/survey");
        return;
      }

      const latestResult = data.surveys[0];

      const transformedResult: SurveyResult = {
        score: latestResult.score || 0,
        totalQuestions: latestResult.totalQuestions || 0,
        technicalQuestionsTotal:
          latestResult.technicalQuestionsTotal ||
          latestResult.technicalQuestions ||
          0,
        qualitativeQuestionsTotal:
          latestResult.qualitativeQuestionsTotal ||
          latestResult.qualitativeQuestions ||
          0,
        percentage: latestResult.percentage || 0,
        timeUsed: latestResult.totalTimeUsed || 0,
        questionsAttempted: latestResult.questionsAttempted || 0,
        skippedQuestions: latestResult.skippedQuestions || 0,
        questionsByLevel: normalizeQuestionsByLevel(
          latestResult.questionsByLevel
        ),
        qualitativeBreakdown: normalizeQuestionsByLevel(
          latestResult.qualitativeBreakdown
        ),
        technicalQuestions: latestResult.technicalQuestions || 0,
        qualitativeQuestions: latestResult.qualitativeQuestions || 0,
        intent: latestResult.intent || "unknown",
        intentConfidence: latestResult.intentConfidence || 0,
        reasoning: latestResult.reasoning || "",
        recommendedPath: latestResult.recommendedPath || "",
        targetRoles: latestResult.targetRoles || [],
        qualitativeClusters: latestResult.qualitativeClusters || [],
        careerInsights: latestResult.careerInsights || "",
        skillGaps: latestResult.skillGaps || [],
        suggestedLearningPath: latestResult.suggestedLearningPath || [],
        focusAreas: latestResult.focusAreas || [],
        aiOptimized: latestResult.aiOptimized || false,
        questions: (latestResult.questions || []).map((q: any) => ({
          questionId: q.questionId || q.id,
          question: q.question,
          userAnswer: q.userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: q.isCorrect,
          category: q.category,
          level: q.level,
          countsTowardScore: q.countsTowardScore,
          isQualitative: q.isQualitative,
        })),
        performanceByLevel: latestResult.performanceByLevel || {},
        performanceByCategory: latestResult.performanceByCategory || {},
        qualitativeAnalysis: latestResult.qualitativeAnalysis || {},
        startedAt: latestResult.startedAt || latestResult.submittedAt,
        submittedAt: latestResult.submittedAt || new Date().toISOString(),
        scoringMethod: latestResult.scoringMethod || "technical_only",
        scoredQuestionsCount: latestResult.scoredQuestionsCount,
        analysisOnlyQuestionsCount: latestResult.analysisOnlyQuestionsCount,
      };

      setResult(transformedResult);
    } catch (error) {
      console.error("Error fetching survey results:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load results"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Loading State
  if (status === "loading" || isLoading) {
    return (
      <div
        className={`min-h-screen ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            Loading Results
          </h2>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Preparing your assessment analysis...
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated
  if (status === "unauthenticated") {
    return null;
  }

  // Error or No Result
  if (error || !result) {
    return (
      <div
        className={`min-h-screen ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        } flex flex-col`}
      >
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <div className="flex-1 flex items-center justify-center px-6 py-4">
          <div className="max-w-md w-full text-center">
            <div
              className={`p-8 rounded-2xl ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border shadow-xl`}
            >
              <div className="text-6xl mb-4">😕</div>
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Results Not Found
              </h2>
              <p
                className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-6`}
              >
                {error || "Unable to load your assessment results."}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={fetchSurveyResults}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-cyan-600 transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push("/survey")}
                  className={`px-6 py-3 ${
                    isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-50"
                  } rounded-xl font-medium transition-all`}
                >
                  Take Assessment
                </button>
                <button
                  onClick={() => router.push("/")}
                  className={`px-6 py-3 ${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-800"
                  } transition-all`}
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="pt-0">
        <SuccessScreen
          isDark={isDark}
          toggleTheme={toggleTheme}
          userId={(session?.user as any)?.id || session?.user?.email}
          score={result.score}
          totalQuestions={result.technicalQuestionsTotal}
          percentage={result.percentage}
          timeUsed={result.timeUsed}
          questionsAttempted={result.questionsAttempted}
          skippedQuestions={result.skippedQuestions}
          technicalQuestions={result.technicalQuestionsTotal}
          qualitativeQuestions={result.qualitativeQuestionsTotal}
          questionsByLevel={result.questionsByLevel}
          qualitativeBreakdown={result.qualitativeBreakdown}
          intent={result.intent}
          intentConfidence={result.intentConfidence}
          reasoning={result.reasoning}
          recommendedPath={result.recommendedPath}
          targetRoles={result.targetRoles}
          qualitativeClusters={result.qualitativeClusters}
          careerInsights={result.careerInsights}
          skillGaps={result.skillGaps}
          suggestedLearningPath={result.suggestedLearningPath}
          focusAreas={result.focusAreas}
          aiOptimized={result.aiOptimized}
          detailedQuestions={result.questions
            .filter((q) => !q.isQualitative && q.countsTowardScore)
            .map((q) => ({ ...q, id: q.questionId }))}
          allQuestionsCount={result.totalQuestions}
          qualitativeQuestionsData={result.questions
            .filter((q) => q.isQualitative)
            .map((q) => ({ ...q, id: q.questionId }))}
        />
      </div>

      {/* Bottom Summary Bar */}
      <div
        className={`sticky bottom-0 ${
          isDark ? "bg-gray-800/90" : "bg-white/90"
        } backdrop-blur-sm shadow-xl border-t ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-center items-center gap-6 text-sm flex-wrap">
            <span className="text-purple-400 font-medium">
              📊 Score: {result.percentage}% ({result.score}/
              {result.technicalQuestionsTotal})
            </span>
            <span className={`${isDark ? "text-gray-600" : "text-gray-400"}`}>
              •
            </span>
            <span className="text-cyan-400">
              📝 Analysis: {result.qualitativeQuestionsTotal} questions
            </span>
            <span className={`${isDark ? "text-gray-600" : "text-gray-400"}`}>
              •
            </span>
            <span className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              ⏱️ {Math.floor(result.timeUsed / 60)}m {result.timeUsed % 60}s
            </span>
            <span className={`${isDark ? "text-gray-600" : "text-gray-400"}`}>
              •
            </span>
            <span className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              🎯 {result.intent}
            </span>
            {result.aiOptimized && (
              <>
                <span
                  className={`${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  •
                </span>
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-medium">
                  ✨ AI Optimized
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
