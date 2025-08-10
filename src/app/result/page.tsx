/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SuccessScreen from "../components/SuccessScreen";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";

interface SurveyResult {
  // Basic Score Data
  score: number;
  totalQuestions: number;
  percentage: number;
  timeUsed: number;
  questionsAttempted: number;
  skippedQuestions: number;

  // Question Breakdown
  questionsByLevel: {
    easy: number;
    medium: number;
    advanced: number;
  };
  technicalQuestions: number;
  qualitativeQuestions: number;

  // Intent-Based Results
  intent: string;
  intentConfidence: number;
  reasoning: string;
  recommendedPath: string;

  // Career Insights
  targetRoles: string[];
  qualitativeClusters: string[];
  careerInsights: string;
  skillGaps: string[];
  suggestedLearningPath: string[];
  focusAreas: string[];

  // AI Metadata
  aiOptimized: boolean;

  // Detailed question data for charts
  questions: Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    category: string;
    level: string;
  }>;

  // Performance data
  performanceByLevel: any;
  performanceByCategory: any;

  // Timestamps
  startedAt: string;
  submittedAt: string;
}

const ResultPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<SurveyResult | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setIsDark(savedTheme === "dark");

    // Check authentication first
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchSurveyResults();
    }
  }, [status, router]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
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

      // First check if user has taken any survey using the existing API
      const statusResponse = await fetch("/api/survey?limit=1&detailed=false");

      if (!statusResponse.ok) {
        throw new Error(
          `Failed to check survey status: ${statusResponse.status}`
        );
      }

      const statusData = await statusResponse.json();

      if (!statusData.surveys || statusData.surveys.length === 0) {
        // No surveys found, redirect to survey
        alert("Please complete the assessment first.");
        router.push("/survey");
        return;
      }

      // Fetch detailed results using the survey API with detailed=true
      const detailedResponse = await fetch("/api/survey?limit=1&detailed=true");

      if (!detailedResponse.ok) {
        if (detailedResponse.status === 404) {
          throw new Error(
            "No assessment results found. Please take the assessment first."
          );
        }
        throw new Error(`Failed to fetch results: ${detailedResponse.status}`);
      }

      const detailedData = await detailedResponse.json();

      if (!detailedData.surveys || detailedData.surveys.length === 0) {
        throw new Error("No detailed results found.");
      }

      const latestResult = detailedData.surveys[0];

      // Transform the data to match our interface
      const transformedResult: SurveyResult = {
        // Basic Score Data
        score: latestResult.score || 0,
        totalQuestions: latestResult.totalQuestions || 0,
        percentage: latestResult.percentage || 0,
        timeUsed: latestResult.totalTimeUsed || 0,
        questionsAttempted: latestResult.questionsAttempted || 0,
        skippedQuestions: latestResult.skippedQuestions || 0,

        // Question Breakdown
        questionsByLevel: latestResult.questionsByLevel || {
          easy: 0,
          medium: 0,
          advanced: 0,
        },
        technicalQuestions: latestResult.technicalQuestions || 0,
        qualitativeQuestions: latestResult.qualitativeQuestions || 0,

        // Intent-Based Results
        intent: latestResult.intent || "unknown",
        intentConfidence: latestResult.intentConfidence || 0,
        reasoning: latestResult.reasoning || "",
        recommendedPath: latestResult.recommendedPath || "",

        // Career Insights
        targetRoles: latestResult.targetRoles || [],
        qualitativeClusters: latestResult.qualitativeClusters || [],
        careerInsights: latestResult.careerInsights || "",
        skillGaps: latestResult.skillGaps || [],
        suggestedLearningPath: latestResult.suggestedLearningPath || [],
        focusAreas: latestResult.focusAreas || [],

        // AI Metadata
        aiOptimized: latestResult.aiOptimized || false,

        // Detailed question data for charts
        questions: latestResult.questions || [],

        // Performance data
        performanceByLevel: latestResult.performanceByLevel || {},
        performanceByCategory: latestResult.performanceByCategory || {},

        // Timestamps
        startedAt: latestResult.startedAt || latestResult.submittedAt,
        submittedAt: latestResult.submittedAt || new Date().toISOString(),
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

  // const handleRetakeAssessment = async () => {
  //   if (
  //     confirm(
  //       "Are you sure you want to retake the assessment? This will allow you to take a new assessment."
  //     )
  //   ) {
  //     // Just redirect to survey - the survey page will handle duplicate checking
  //     router.push("/survey");
  //   }
  // };

  // const handleViewAllResults = () => {
  //   // Navigate to a results history page if you have one
  //   // For now, just refresh the current results
  //   fetchSurveyResults();
  // };

  // Show loading screen while checking authentication and fetching data
  if (status === "loading" || isLoading) {
    return <LoadingScreen isDark={isDark} toggleTheme={toggleTheme} />;
  }

  // Don't render anything if unauthenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  // Show error state
  if (error || !result) {
    return (
      <div
        className={`min-h-screen flex flex-col ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <div className="flex-1 flex items-center justify-center px-6 py-4">
          <div className="max-w-md w-full text-center">
            <div
              className={`p-6 rounded-lg border ${
                isDark
                  ? "bg-red-900/20 text-red-400 border-red-800"
                  : "bg-red-50 text-red-700 border-red-300"
              }`}
            >
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-xl font-semibold mb-4">Results Not Found</h2>
              <p className="text-sm mb-6">
                {error || "Unable to load your assessment results."}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={fetchSurveyResults}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push("/survey")}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Take Assessment
                </button>
                <button
                  onClick={() => router.push("/")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
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

  // Show success screen with results
  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header with additional actions */}
      {/* <div
        className={`sticky top-0 z-20 ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Assessment Results
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Completed on {new Date(result.submittedAt).toLocaleDateString()}
              </p>
              {result.intent && (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    isDark
                      ? "bg-blue-900/30 text-blue-400"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  Intent: {result.intent}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={handleViewAllResults}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              🔄 Refresh
            </button>


            <button
              onClick={handleRetakeAssessment}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              📝 Retake Assessment
            </button>

      
            <button
              onClick={() => router.push("/")}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                isDark
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              🏠 Home
            </button>


            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div> */}

      {/* Results Content */}
      <div className="pt-0">
        <SuccessScreen
          isDark={isDark}
          toggleTheme={toggleTheme}
          userId={(session?.user as any)?.id || session?.user?.email}
          // Basic Score Data
          score={result.score}
          totalQuestions={result.totalQuestions}
          percentage={result.percentage}
          timeUsed={result.timeUsed}
          questionsAttempted={result.questionsAttempted}
          skippedQuestions={result.skippedQuestions}
          // Question Breakdown
          questionsByLevel={result.questionsByLevel}
          technicalQuestions={result.technicalQuestions}
          qualitativeQuestions={result.qualitativeQuestions}
          // Intent-Based Results
          intent={result.intent}
          intentConfidence={result.intentConfidence}
          reasoning={result.reasoning}
          recommendedPath={result.recommendedPath}
          // Career Insights
          targetRoles={result.targetRoles}
          qualitativeClusters={result.qualitativeClusters}
          careerInsights={result.careerInsights}
          skillGaps={result.skillGaps}
          suggestedLearningPath={result.suggestedLearningPath}
          focusAreas={result.focusAreas}
          // AI Metadata
          aiOptimized={result.aiOptimized}
          // Detailed question data for charts
          detailedQuestions={result.questions.map((q: any) => ({
            id: q.questionId,
            question: q.question,
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.isCorrect,
            category: q.category,
            level: q.level,
          }))}
        />
      </div>

      {/* Bottom Actions */}
      <div
        className={`sticky bottom-0 ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-md border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-center items-center gap-4 text-sm">
            <span className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              📊 Assessment completed with {result.percentage}% accuracy
            </span>
            <span className="text-gray-400">•</span>
            <span className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              ⏱️ Time spent: {Math.floor(result.timeUsed / 60)}m{" "}
              {result.timeUsed % 60}s
            </span>
            <span className="text-gray-400">•</span>
            <span className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              🎯 Intent: {result.intent}
            </span>
            {result.aiOptimized && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-purple-500">✨ AI Optimized</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
