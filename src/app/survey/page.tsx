/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import SurveyHeader from "../components/SurveyHeader";
import SurveyProgress from "../components/SurveyProgress";
import QuestionCard from "../components/QuestionCard";
import Navigation from "@/components/Navigation";
import LoadingScreen from "../components/LoadingScreen";
import InstructionsPopup from "../components/InstructionsPopup";

// Import types and services
import { SurveyQuestion } from "../types/quiz";
import { QuestionService } from "../services/questionService";

interface DetailedQuestion {
  questionId: string;
  questionNumber: number;
  question: string;
  category: string;
  level: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
  isCorrect: boolean;
  countsTowardScore: boolean; // Whether this question affects the score
  timeSpent: number;
  answeredAt: Date | null;
  wasChanged: boolean;
  isQualitative?: boolean;
  // Additional fields for better tracking
  answered?: boolean;
  responseText?: string | null;
}

const SurveyPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: boolean;
  }>({});
  const [totalTimeLeft, setTotalTimeLeft] = useState(3600);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState<{ [key: number]: number }>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  const [hasPayment, setHasPayment] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [surveyStartTime, setSurveyStartTime] = useState<Date | null>(null);
  const [answerChanges, setAnswerChanges] = useState<{
    [key: number]: boolean;
  }>({});
  const [detailedQuestions, setDetailedQuestions] = useState<
    DetailedQuestion[]
  >([]);

  // New states for intent-based system
  const [assessmentMetadata, setAssessmentMetadata] = useState<any>({});
  const [userIntent, setUserIntent] = useState<any>({});
  const [score, setScore] = useState(0);
  const [questionsLoadError, setQuestionsLoadError] = useState<string>("");

  // New state for survey completion tracking
  const [hasTakenSurvey, setHasTakenSurvey] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showRefreshWarning, setShowRefreshWarning] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setIsDark(savedTheme === "dark");

    // Check authentication first
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      // Check if user has already taken the survey
      checkSurveyStatusAndRedirect();
    }
  }, [status, router]);

  // Auto-save functionality
  const saveProgressToStorage = useCallback(async () => {
    if (!session?.user?.email || Object.keys(answers).length === 0) return;

    try {
      setAutoSaveStatus("saving");

      const progressData = {
        userId: session.user.email,
        answers,
        currentQuestion,
        timeSpent,
        totalTimeUsed: 3600 - totalTimeLeft,
        lastSaved: new Date().toISOString(),
        surveyStartTime: surveyStartTime?.toISOString(),
        questionStartTime,
        assessmentMetadata,
        userIntent,
      };

      localStorage.setItem(
        "dhiti_survey_progress",
        JSON.stringify(progressData)
      );

      setLastAutoSave(new Date());
      setAutoSaveStatus("saved");

      // Show 'saved' status briefly, then return to idle
      setTimeout(() => setAutoSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving progress:", error);
      setAutoSaveStatus("error");
      setTimeout(() => setAutoSaveStatus("idle"), 3000);
    }
  }, [
    session,
    answers,
    currentQuestion,
    timeSpent,
    totalTimeLeft,
    surveyStartTime,
    questionStartTime,
    assessmentMetadata,
    userIntent,
  ]);

  // Load saved progress on component mount
  const loadSavedProgress = useCallback(() => {
    if (!session?.user?.email) return;

    try {
      const savedData = localStorage.getItem("dhiti_survey_progress");
      if (!savedData) return;

      const progressData = JSON.parse(savedData);

      // Verify this saved data belongs to current user
      if (progressData.userId !== session.user.email) return;

      // Check if saved data is not too old (24 hours)
      const savedTime = new Date(progressData.lastSaved);
      const now = new Date();
      const hoursDiff =
        (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        localStorage.removeItem("dhiti_survey_progress");
        return;
      }

      // Restore saved progress
      setAnswers(progressData.answers || {});
      setCurrentQuestion(progressData.currentQuestion || 0);
      setTimeSpent(progressData.timeSpent || {});

      if (progressData.surveyStartTime) {
        setSurveyStartTime(new Date(progressData.surveyStartTime));
      }

      if (progressData.totalTimeUsed) {
        setTotalTimeLeft(Math.max(0, 3600 - progressData.totalTimeUsed));
      }

      if (progressData.assessmentMetadata) {
        setAssessmentMetadata(progressData.assessmentMetadata);
      }

      if (progressData.userIntent) {
        setUserIntent(progressData.userIntent);
      }

      setLastAutoSave(new Date(progressData.lastSaved));
      console.log("Progress restored from auto-save:", {
        answersRestored: Object.keys(progressData.answers || {}).length,
        questionPosition: progressData.currentQuestion,
        timeUsed: progressData.totalTimeUsed,
      });
    } catch (error) {
      console.error("Error loading saved progress:", error);
      localStorage.removeItem("dhiti_survey_progress");
    }
  }, [session]);

  // Clear saved progress when survey is completed
  const clearSavedProgress = useCallback(() => {
    localStorage.removeItem("dhiti_survey_progress");
    setLastAutoSave(null);
    setAutoSaveStatus("idle");
  }, []);

  const checkSurveyStatusAndRedirect = async () => {
    try {
      setIsLoading(true);

      // Check if user has already taken the survey using the existing API
      const surveyResponse = await fetch("/api/survey?limit=1&detailed=false");
      if (surveyResponse.ok) {
        const surveyData = await surveyResponse.json();

        if (surveyData.surveys && surveyData.surveys.length > 0) {
          // User has already taken a survey, redirect to results
          console.log("User has already taken survey, redirecting to results");
          router.push("/result");
          return;
        }
      }

      // Continue with payment and profile checks
      checkPaymentProfileAndLoadQuestions();
    } catch (error) {
      console.error("Error checking survey status:", error);
      // Continue with normal flow even if status check fails
      checkPaymentProfileAndLoadQuestions();
    }
  };

  const checkPaymentProfileAndLoadQuestions = async () => {
    try {
      setIsLoading(true);

      // First check if user has paid
      const paymentResponse = await fetch("/api/payment/status");
      const paymentData = await paymentResponse.json();

      if (!paymentData.hasPaid) {
        alert("Please complete your payment first to access the assessment.");
        router.push("/payment");
        return;
      }

      setHasPayment(true);

      // Then check if user has completed profile
      await checkUserProfile();
    } catch (error) {
      console.error("Error checking prerequisites:", error);
      router.push("/payment");
    }
  };

  const checkUserProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (!data.profile) {
        alert(
          "Please complete your profile first before taking the assessment."
        );
        router.push("/profile");
        return;
      }

      setHasProfile(true);

      // Load questions after all checks pass
      await loadQuestionsFromFirestore();
    } catch (error) {
      console.error("Error checking profile:", error);
      router.push("/profile");
    }
  };

  const loadQuestionsFromFirestore = async () => {
    try {
      setIsLoading(true);
      setQuestionsLoadError("");

      // First, load user's profile to get intent parameters
      const profileResponse = await fetch("/api/profile");
      const profileData = await profileResponse.json();

      if (!profileData.profile) {
        throw new Error(
          "Profile data not found. Please complete your profile first."
        );
      }

      const userProfile = profileData.profile;
      console.log("User profile loaded:", userProfile);

      // Use intent-based question selection with AI optimization
      const { questions, intent, metadata } =
        await QuestionService.getIntentBasedQuestions(
          {
            age_group: userProfile.age_group,
            education: userProfile.education,
            experience: userProfile.experience,
            purpose: userProfile.purpose,
            functional_area: userProfile.functional_area,
            current_role: userProfile.current_role || userProfile.roles,
            target_roles: userProfile.target_roles || [],
          },
          {
            useAIOptimization: true,
          }
        );

      if (!questions || questions.length === 0) {
        throw new Error("No questions found for your profile configuration");
      }

      console.log(`📝 Raw questions received: ${questions.length}`);

      // NO DUPLICATION FILTER - Use all questions as received
      const questionsWithIds = questions.map(
        (question: any, index: number) => ({
          ...question,
          id: question.id || `question_${index}_${Date.now()}`,
          uniqueIndex: index,
          // Ensure proper question classification
          isQualitative: question.isQualitative || false,
          required: question.required !== false, // Default to required unless explicitly false
        })
      );

      // Validate question structure
      const validQuestions = questionsWithIds.filter((question: any) => {
        if (!question.question || question.question.trim() === "") {
          console.warn(`⚠️ Skipping question with empty text:`, question);
          return false;
        }
        if (
          !question.options ||
          !Array.isArray(question.options) ||
          question.options.length === 0
        ) {
          console.warn(
            `⚠️ Skipping question with no options:`,
            question.question?.substring(0, 50)
          );
          return false;
        }
        return true;
      });

      console.log(
        `📝 After validation: ${validQuestions.length} valid questions`
      );

      setQuestions(validQuestions);
      setIsLoading(false);

      // Store intent and metadata for submission
      setUserIntent(intent);
      setAssessmentMetadata({
        intent: intent.intent,
        intentConfidence: intent.confidence,
        reasoning: intent.reasoning,
        recommendedPath: intent.recommendedPath,
        ...metadata,
      });

      // Enhanced logging for question breakdown
      const technicalQuestions = validQuestions.filter(
        (q: any) => !q.isQualitative
      );
      const qualitativeQuestions = validQuestions.filter(
        (q: any) => q.isQualitative
      );

      console.log(
        `✅ Loaded ${validQuestions.length} questions for intent: ${intent.intent}`
      );
      console.log(`📊 Question breakdown:`);
      console.log(`  - Technical: ${technicalQuestions.length} (with scoring)`);
      console.log(
        `  - Qualitative: ${qualitativeQuestions.length} (for analysis)`
      );
      console.log(`  - Total: ${validQuestions.length}`);

      // Log level distribution
      const levelCounts = {
        technical: { easy: 0, medium: 0, advanced: 0 },
        qualitative: { easy: 0, medium: 0, advanced: 0 },
      };

      technicalQuestions.forEach((q: any) => {
        const level = q.level?.toLowerCase();
        if (level === "easy") levelCounts.technical.easy++;
        else if (level === "medium") levelCounts.technical.medium++;
        else if (level === "advanced" || level === "hard")
          levelCounts.technical.advanced++;
      });

      qualitativeQuestions.forEach((q: any) => {
        const level = q.level?.toLowerCase();
        if (level === "easy") levelCounts.qualitative.easy++;
        else if (level === "medium") levelCounts.qualitative.medium++;
        else if (level === "advanced" || level === "hard")
          levelCounts.qualitative.advanced++;
      });

      console.log(`📈 Level distribution:`, levelCounts);
      console.log(`Intent reasoning: ${intent.reasoning}`);
      console.log(`Recommended path: ${intent.recommendedPath}`);

      if (intent.recommendedPath) {
        console.log("Assessment customized for:", intent.recommendedPath);
      }

      // Load any saved progress after questions are loaded
      loadSavedProgress();
    } catch (error) {
      console.error("Error loading questions from Firestore:", error);
      setQuestionsLoadError(
        error instanceof Error ? error.message : "Failed to load questions"
      );
      setIsLoading(false);
    }
  };

  const handleInstructionsAccepted = () => {
    setInstructionsAccepted(true);
    setTimerActive(true);
    setQuestionStartTime(Date.now());
    setSurveyStartTime(new Date());
    setSurveyCompleted(false); // Ensure survey is not marked as completed when starting
  };

  // Auto-save timer - saves every 30 seconds when there are changes
  useEffect(() => {
    if (
      !instructionsAccepted ||
      surveyCompleted ||
      Object.keys(answers).length === 0
    ) {
      return;
    }

    const autoSaveInterval = setInterval(() => {
      saveProgressToStorage();
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [instructionsAccepted, surveyCompleted, answers, saveProgressToStorage]);

  // Save progress when answers change (debounced)
  useEffect(() => {
    if (
      !instructionsAccepted ||
      surveyCompleted ||
      Object.keys(answers).length === 0
    ) {
      return;
    }

    const saveTimeout = setTimeout(() => {
      saveProgressToStorage();
    }, 2000); // Debounce: save 2 seconds after last answer change

    return () => clearTimeout(saveTimeout);
  }, [answers, instructionsAccepted, surveyCompleted, saveProgressToStorage]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    const percentLeft = (totalTimeLeft / 3600) * 100;
    if (percentLeft <= 10) return isDark ? "text-red-400" : "text-red-600";
    if (percentLeft <= 25)
      return isDark ? "text-orange-400" : "text-orange-600";
    return isDark ? "text-purple-400" : "text-purple-600";
  };

  const getProgressBarColor = () => {
    const percentLeft = (totalTimeLeft / 3600) * 100;
    if (percentLeft <= 10) return "bg-red-500";
    if (percentLeft <= 25) return "bg-orange-500";
    return "bg-purple-500";
  };

  // Enhanced prepareDetailedQuestions to store ALL question results
  const prepareDetailedQuestions = useCallback(() => {
    const detailed: DetailedQuestion[] = questions.map((question, index) => {
      const userAnswerIndex = answers[question.id];
      const userAnswer =
        typeof userAnswerIndex === "number"
          ? question.options && question.options[userAnswerIndex]
            ? String.fromCharCode(97 + userAnswerIndex)
            : null
          : null;

      // Calculate isCorrect for technical questions, store response for qualitative
      const isCorrect =
        !question.isQualitative && userAnswer === question.correctAnswer;
      const countsTowardScore =
        !question.isQualitative && !!question.correctAnswer;

      return {
        questionId: `q_${question.id}`,
        questionNumber: index + 1,
        question: question.question,
        category: question.category || "General",
        level: question.level || "medium",
        options: question.options || [],
        correctAnswer: question.correctAnswer || "",
        userAnswer, // This now stores responses for BOTH technical and qualitative
        isCorrect,
        countsTowardScore,
        timeSpent: timeSpent[index] || 0,
        answeredAt: userAnswer ? new Date() : null,
        wasChanged: answerChanges[question.id] || false,
        isQualitative: question.isQualitative || false,
        // Add additional fields for better tracking
        answered: userAnswer !== null,
        responseText:
          userAnswerIndex !== undefined &&
          question.options &&
          question.options[userAnswerIndex]
            ? question.options[userAnswerIndex]
            : null,
      };
    });

    // Log detailed breakdown
    const technical = detailed.filter((q) => !q.isQualitative);
    const qualitative = detailed.filter((q) => q.isQualitative);
    const technicalAnswered = technical.filter((q) => q.answered).length;
    const qualitativeAnswered = qualitative.filter((q) => q.answered).length;

    console.log(`📊 Detailed Questions Prepared:`);
    console.log(`  - Total Questions: ${detailed.length}`);
    console.log(
      `  - Technical: ${technical.length} (${technicalAnswered} answered)`
    );
    console.log(
      `  - Qualitative: ${qualitative.length} (${qualitativeAnswered} answered)`
    );
    console.log(
      `  - Total Answered: ${detailed.filter((q) => q.answered).length}`
    );

    return detailed;
  }, [questions, answers, timeSpent, answerChanges]);

  // Calculate score function for TECHNICAL QUESTIONS ONLY
  const calculateScore = useCallback(() => {
    let correctAnswers = 0;
    let technicalQuestionsCount = 0;

    questions.forEach((question) => {
      // Only score technical questions (must have correctAnswer and NOT be qualitative)
      if (
        !question.isQualitative &&
        question.correctAnswer &&
        question.correctAnswer.trim() !== ""
      ) {
        technicalQuestionsCount++;
        const userAnswer = answers[question.id];
        if (typeof userAnswer === "number" && question.options) {
          const answerLetter = String.fromCharCode(97 + userAnswer);
          if (answerLetter === question.correctAnswer) {
            correctAnswers++;
          }
        }
      }
    });

    console.log(`🎯 SCORING CALCULATION:`);
    console.log(`  - Total Questions: ${questions.length}`);
    console.log(
      `  - Technical Questions (scorable): ${technicalQuestionsCount}`
    );
    console.log(
      `  - Qualitative Questions: ${questions.length - technicalQuestionsCount}`
    );
    console.log(`  - Correct Technical Answers: ${correctAnswers}`);
    console.log(
      `  - Technical Score: ${correctAnswers}/${technicalQuestionsCount}`
    );

    // Store technical questions count for percentage calculation
    setAssessmentMetadata((prev: any) => ({
      ...prev,
      actualTechnicalCount: technicalQuestionsCount,
    }));

    return correctAnswers;
  }, [answers, questions]);

  // Enhanced submitSurvey function with proper level calculation
  const submitSurvey = useCallback(async () => {
    const timeSpentOnQuestion = Math.floor(
      (Date.now() - questionStartTime) / 1000
    );
    setTimeSpent((prev) => ({
      ...prev,
      [currentQuestion]: timeSpentOnQuestion,
    }));

    const errors: { [key: number]: boolean } = {};
    let requiredSkipped = 0;
    let totalRequired = 0;

    // Better validation logic
    questions.forEach((question) => {
      if (question.required !== false) {
        // Default to required unless explicitly false
        totalRequired++;
        const answer = answers[question.id];
        const isValid = answer !== null && answer !== undefined;
        if (!isValid) {
          errors[question.id] = true;
          requiredSkipped++;
        }
      }
    });

    console.log(`📋 Validation Results:`);
    console.log(`  - Total Questions: ${questions.length}`);
    console.log(`  - Required Questions: ${totalRequired}`);
    console.log(`  - Required Skipped: ${requiredSkipped}`);
    console.log(`  - Total Answered: ${Object.keys(answers).length}`);

    // More lenient validation - allow submission if most questions are answered
    if (Object.keys(errors).length > 0) {
      const skipPercentage = (requiredSkipped / totalRequired) * 100;

      if (skipPercentage > 20) {
        // Only block if more than 20% of required questions are skipped
        setValidationErrors(errors);
        const firstErrorIndex = questions.findIndex((q) => errors[q.id]);
        setCurrentQuestion(firstErrorIndex);
        alert(
          `Please answer more questions. You have skipped ${requiredSkipped} required questions (${skipPercentage.toFixed(
            1
          )}% of required questions).`
        );
        return;
      } else {
        console.log(
          `⚠️ Allowing submission with ${requiredSkipped} skipped questions (${skipPercentage.toFixed(
            1
          )}%)`
        );
      }
    }

    setIsSubmitting(true);
    setTimerActive(false);

    try {
      const finalScore = calculateScore();
      setScore(finalScore);

      const detailedQuestionsData = prepareDetailedQuestions();
      setDetailedQuestions(detailedQuestionsData);

      // Better counting of attempted questions (ALL questions, not just answers object)
      const totalAnswered = detailedQuestionsData.filter(
        (q) => q.answered
      ).length;
      const questionsAttempted = totalAnswered;

      // Strict separation of technical vs qualitative questions for scoring
      const allQuestions = questions || [];

      // Only technical questions with valid correctAnswer are used for scoring
      const technicalQuestions = allQuestions.filter(
        (q) =>
          !q.isQualitative && q.correctAnswer && q.correctAnswer.trim() !== ""
      );

      // All qualitative questions (regardless of correctAnswer)
      const qualitativeQuestions = allQuestions.filter((q) => q.isQualitative);

      // Questions that are neither technical nor qualitative (should not exist)
      const uncategorizedQuestions = allQuestions.filter(
        (q) =>
          !q.isQualitative &&
          (!q.correctAnswer || q.correctAnswer.trim() === "")
      );

      const technicalQuestionsCount = technicalQuestions.length;
      const qualitativeQuestionsCount = qualitativeQuestions.length;

      console.log(`📋 FINAL Question Classification for Scoring:`);
      console.log(`  - Total Questions Loaded: ${allQuestions.length}`);
      console.log(
        `  - Technical Questions (FOR SCORING): ${technicalQuestionsCount}`
      );
      console.log(
        `  - Qualitative Questions (FOR ANALYSIS): ${qualitativeQuestionsCount}`
      );
      console.log(
        `  - Uncategorized Questions: ${uncategorizedQuestions.length}`
      );
      console.log(`  - Questions Attempted: ${questionsAttempted}`);
      console.log(
        `  - Technical Score: ${finalScore}/${technicalQuestionsCount}`
      );

      if (uncategorizedQuestions.length > 0) {
        console.warn(
          `⚠️ Found ${uncategorizedQuestions.length} uncategorized questions:`,
          uncategorizedQuestions.map((q) => q.question?.substring(0, 50))
        );
      }

      // Level breakdown calculation with STRICT separation
      const calculateLevelBreakdown = (
        questionSet: any[],
        type: "technical" | "qualitative"
      ) => {
        const levelMap = { easy: 0, medium: 0, advanced: 0 };

        questionSet.forEach((q) => {
          // Normalize level names to lowercase and handle variations
          const normalizedLevel = q.level?.toLowerCase();

          if (normalizedLevel === "easy") {
            levelMap.easy++;
          } else if (normalizedLevel === "medium") {
            levelMap.medium++;
          } else if (
            normalizedLevel === "advanced" ||
            normalizedLevel === "hard"
          ) {
            levelMap.advanced++;
          } else {
            // Log unknown levels for debugging
            console.warn(
              `Unknown level "${q.level}" in ${type} question:`,
              q.question?.substring(0, 50)
            );
          }
        });

        console.log(`📊 ${type} level breakdown:`, levelMap);
        return levelMap;
      };

      // Calculate level breakdowns using ONLY properly classified questions
      const questionsByLevel = calculateLevelBreakdown(
        technicalQuestions,
        "technical"
      );
      const qualitativeBreakdown = calculateLevelBreakdown(
        qualitativeQuestions,
        "qualitative"
      );

      // Calculate percentage based ONLY on technical questions
      const technicalPercentage =
        technicalQuestionsCount > 0
          ? Math.round((finalScore / technicalQuestionsCount) * 100)
          : 0;

      console.log(`🎯 FINAL SCORING METRICS:`);
      console.log(
        `  - Technical Score: ${finalScore}/${technicalQuestionsCount} (${technicalPercentage}%)`
      );
      console.log(`  - Technical Levels:`, questionsByLevel);
      console.log(`  - Qualitative Levels:`, qualitativeBreakdown);

      // Enhanced survey data with proper field mapping and ALL questions included
      const surveyData = {
        // Basic survey data - Updated scoring logic
        startedAt: surveyStartTime,
        totalTimeUsed: 3600 - totalTimeLeft,
        score: finalScore, // Only technical questions
        totalQuestions: allQuestions.length, // ALL questions loaded

        // Use the exact field names that the API expects
        technicalQuestionsTotal: technicalQuestionsCount,
        qualitativeQuestionsTotal: qualitativeQuestionsCount,

        questionsAttempted, // Now counts ALL answered questions
        skippedQuestions: allQuestions.length - questionsAttempted,
        percentage: technicalPercentage,

        // Scoring metadata with exact field names
        scoringMethod: "technical_only",
        scoredQuestionsCount: technicalQuestionsCount,
        analysisOnlyQuestionsCount: qualitativeQuestionsCount,

        // Level breakdowns with proper structure
        questionsByLevel, // Technical questions by level
        qualitativeBreakdown, // Qualitative questions by level

        // Question counts (legacy fields for backward compatibility)
        technicalQuestions: technicalQuestionsCount,
        qualitativeQuestions: qualitativeQuestionsCount,

        // Include ALL questions in detailed data (both technical and qualitative)
        questions: detailedQuestionsData, // This now includes ALL questions with their responses

        // Timing and interaction data
        timeSpent,
        answers, // Raw answers object for reference

        // Intent-based metadata
        assessmentType: "intent-based",
        intent: assessmentMetadata.intent,
        intentConfidence: assessmentMetadata.intentConfidence,
        reasoning: assessmentMetadata.reasoning,
        recommendedPath: assessmentMetadata.recommendedPath,

        // Career insights
        targetRoles: assessmentMetadata.technicalBreakdown?.byRole || [],
        qualitativeClusters:
          assessmentMetadata.qualitativeBreakdown?.clusters || [],
        careerInsights: assessmentMetadata.careerInsights,
        skillGaps: assessmentMetadata.skillGaps,
        suggestedLearningPath: assessmentMetadata.suggestedLearningPath,
        aiOptimized: assessmentMetadata.aiOptimized || false,
        focusAreas: assessmentMetadata.focusAreas,

        // System metadata
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      // Debug logging to verify data before submission
      console.log("📋 Survey Data Debug Before Submission:", {
        totalQuestions: surveyData.totalQuestions,
        technicalQuestionsTotal: surveyData.technicalQuestionsTotal,
        qualitativeQuestionsTotal: surveyData.qualitativeQuestionsTotal,
        questionsByLevel: surveyData.questionsByLevel,
        qualitativeBreakdown: surveyData.qualitativeBreakdown,
        score: surveyData.score,
        percentage: surveyData.percentage,
        technicalQuestions: technicalQuestions.map((q) => ({
          level: q.level,
          normalized: q.level?.toLowerCase(),
        })),
        qualitativeQuestions: qualitativeQuestions.map((q) => ({
          level: q.level,
          normalized: q.level?.toLowerCase(),
        })),
      });

      // Submit survey results using the existing API endpoint
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Survey submitted successfully:", result);
        setSurveyCompleted(true); // Mark survey as completed to prevent refresh warnings
        clearSavedProgress(); // Clear auto-saved progress since survey is now complete

        // Clear success message emphasizing technical-only scoring
        const technicalAnswered = technicalQuestions.filter(
          (q) => answers[q.id] !== undefined
        ).length;
        const qualitativeAnswered = qualitativeQuestions.filter(
          (q) => answers[q.id] !== undefined
        ).length;

        const successMessage = `Assessment Completed Successfully!

Technical Score: ${technicalPercentage}% (${finalScore}/${technicalQuestionsCount})
   Only technical questions count toward your score

Response Summary:
   • Total Questions: ${surveyData.totalQuestions}
   • Technical Questions: ${technicalQuestionsCount} (${technicalAnswered} answered)
   • Qualitative Questions: ${qualitativeQuestionsCount} (${qualitativeAnswered} answered)
   
Difficulty Breakdown:
   • Technical (Scored): Easy ${questionsByLevel.easy}, Medium ${questionsByLevel.medium}, Advanced ${questionsByLevel.advanced}
   • Qualitative (Analysis): Easy ${qualitativeBreakdown.easy}, Medium ${qualitativeBreakdown.medium}, Advanced ${qualitativeBreakdown.advanced}

All responses saved for analysis and career insights!

Redirecting to detailed results...`;

        alert(successMessage);

        // Small delay to show the success message, then redirect
        setTimeout(() => {
          router.push("/result");
        }, 1000);
      } else {
        throw new Error(result.error || "Failed to save survey results");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    answers,
    questions,
    currentQuestion,
    questionStartTime,
    timeSpent,
    totalTimeLeft,
    calculateScore,
    surveyStartTime,
    prepareDetailedQuestions,
    assessmentMetadata,
    router,
  ]);

  const handleTimeUp = useCallback(() => {
    setTimerActive(false);
    alert("Time is up! Your survey will be submitted automatically.");
    submitSurvey();
  }, [submitSurvey]);

  useEffect(() => {
    if (!timerActive || isLoading) return;

    const timer = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, isLoading, handleTimeUp]);

  useEffect(() => {
    if (instructionsAccepted) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion, instructionsAccepted]);

  // Simplified refresh protection with auto-save backup
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const surveyActive = instructionsAccepted && !surveyCompleted;
      const hasAnswers = Object.keys(answers).length > 0;

      if (surveyActive && hasAnswers) {
        // Save progress one final time before leaving
        saveProgressToStorage();

        // Show minimal browser warning
        event.returnValue =
          "Your progress has been auto-saved and will be restored when you return.";
        return "Your progress has been auto-saved and will be restored when you return.";
      }
    };

    if (instructionsAccepted && !surveyCompleted) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [instructionsAccepted, surveyCompleted, answers, saveProgressToStorage]);

  const validateCurrentQuestion = () => {
    const question = questions[currentQuestion];
    if (!question) return true; // If no question, consider valid

    // Only validate if question is marked as required
    if (!question.required) return true;

    const answer = answers[question.id];
    const isValid = answer !== null && answer !== undefined;

    if (!isValid) {
      setValidationErrors((prev) => ({ ...prev, [question.id]: true }));
      console.log(
        `⚠️ Validation failed for question ${
          question.id
        }: ${question.question?.substring(0, 50)}`
      );
    } else {
      // Clear validation error if answer is valid
      setValidationErrors((prev) => ({ ...prev, [question.id]: false }));
    }

    return isValid;
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    if (answers[questionId] !== undefined && answers[questionId] !== value) {
      setAnswerChanges((prev) => ({ ...prev, [questionId]: true }));
    }

    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (validationErrors[questionId]) {
      setValidationErrors((prev) => ({ ...prev, [questionId]: false }));
    }

    // Trigger auto-save after answer change (will be debounced)
    setAutoSaveStatus("idle");
  };

  const nextQuestion = () => {
    if (validateCurrentQuestion()) {
      const timeSpentOnQuestion = Math.floor(
        (Date.now() - questionStartTime) / 1000
      );
      setTimeSpent((prev) => ({
        ...prev,
        [currentQuestion]: timeSpentOnQuestion,
      }));

      const newIndex = Math.min(currentQuestion + 1, questions.length - 1);
      console.log(`➡️ Moving to question ${newIndex + 1}/${questions.length}`);
      setCurrentQuestion(newIndex);
    }
  };

  const prevQuestion = () => {
    const timeSpentOnQuestion = Math.floor(
      (Date.now() - questionStartTime) / 1000
    );
    setTimeSpent((prev) => ({
      ...prev,
      [currentQuestion]: timeSpentOnQuestion,
    }));

    const newIndex = Math.max(currentQuestion - 1, 0);
    console.log(`⬅️ Moving to question ${newIndex + 1}/${questions.length}`);
    setCurrentQuestion(newIndex);
  };

  // Show loading screen while checking authentication, payment, profile, and survey status
  if (status === "loading" || isLoading) {
    return <LoadingScreen isDark={isDark} toggleTheme={toggleTheme} />;
  }

  // Don't render anything if unauthenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  // Show error if questions failed to load
  if (questionsLoadError) {
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
              className={`p-6 rounded-lg border border-red-300 ${
                isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-700"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">
                Failed to Load Questions
              </h2>
              <p className="text-sm mb-4">{questionsLoadError}</p>
              <button
                onClick={() => loadQuestionsFromFirestore()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show instructions popup
  if (!instructionsAccepted && questions.length > 0) {
    return (
      <div
        className={`h-screen overflow-hidden flex flex-col ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <InstructionsPopup
          isDark={isDark}
          onAccept={handleInstructionsAccepted}
        />
      </div>
    );
  }

  // Main survey interface
  if (questions.length > 0) {
    const currentQ = questions[currentQuestion];

    // Enhanced debug log for development
    if (process.env.NODE_ENV === "development") {
      const technicalScored = questions.filter(
        (q) => !q.isQualitative && q.correctAnswer
      );
      const qualitativeAnalysis = questions.filter((q) => q.isQualitative);
      const currentQ = questions[currentQuestion];

      console.log(`📊 Survey Interface Debug:`, {
        totalQuestions: questions.length,
        currentQuestion: currentQuestion + 1,
        technicalScored: technicalScored.length,
        qualitativeAnalysis: qualitativeAnalysis.length,
        answered: Object.keys(answers).length,
        currentQuestionType: currentQ?.isQualitative
          ? "Qualitative (Analysis)"
          : "Technical (Scored)",
        currentQuestionHasCorrectAnswer: !!currentQ?.correctAnswer,
        currentQuestionLevel: currentQ?.level,
      });
    }

    return (
      <div
        className={`h-screen overflow-hidden flex flex-col ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <div className="flex-1 flex flex-col px-6 py-4 max-w-5xl mx-auto w-full pt-20">
          <SurveyHeader
            isDark={isDark}
            totalTimeLeft={totalTimeLeft}
            formatTime={formatTime}
            getTimerColor={getTimerColor}
          />

          <SurveyProgress
            isDark={isDark}
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            totalTimeLeft={totalTimeLeft}
            getProgressBarColor={getProgressBarColor}
          />

          {/* Clear assessment info showing scoring vs analysis separation and auto-save status */}
          <div
            className={`text-xs mb-2 flex justify-between ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <span>
              Intent: {userIntent.intent} | Total: {questions.length} |
              <span className="text-green-600 font-medium">
                {" "}
                SCORED:{" "}
                {
                  questions.filter((q) => !q.isQualitative && q.correctAnswer)
                    .length
                }{" "}
                technical
              </span>{" "}
              |
              <span className="text-blue-600">
                {" "}
                ANALYSIS: {questions.filter((q) => q.isQualitative).length}{" "}
                qualitative
              </span>{" "}
              | Progress: {currentQuestion + 1}/{questions.length}
              {Object.keys(answers).length > 0 && (
                <span className="ml-2">
                  {autoSaveStatus === "saving" && (
                    <span className="text-blue-500">Saving...</span>
                  )}
                  {autoSaveStatus === "saved" && (
                    <span className="text-green-600">Auto-saved</span>
                  )}
                  {autoSaveStatus === "error" && (
                    <span className="text-red-500">Save failed</span>
                  )}
                  {autoSaveStatus === "idle" && lastAutoSave && (
                    <span className="text-gray-500">
                      Last saved: {lastAutoSave.toLocaleTimeString()}
                    </span>
                  )}
                </span>
              )}
            </span>
            {session?.user && <span>Taking as: {session.user.email}</span>}
          </div>

          <QuestionCard
            question={{
              ...currentQ,
              level:
                currentQ.level === "easy" ||
                currentQ.level === "Medium" ||
                currentQ.level === "Hard"
                  ? currentQ.level
                  : undefined,
            }}
            answer={answers[currentQ.id]}
            isDark={isDark}
            hasError={validationErrors[currentQ.id]}
            onAnswerChange={handleAnswerChange}
          />

          <Navigation
            isDark={isDark}
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            isSubmitting={isSubmitting}
            onPrev={prevQuestion}
            onNext={nextQuestion}
            onSave={() => {
              const timeSpentOnQuestion = Math.floor(
                (Date.now() - questionStartTime) / 1000
              );
              setTimeSpent((prev) => ({
                ...prev,
                [currentQuestion]: timeSpentOnQuestion,
              }));
              console.log("Auto-saving progress...", {
                timeSpent,
                totalTimeUsed: 3600 - totalTimeLeft,
              });
            }}
            onSubmit={submitSurvey}
          />
        </div>
      </div>
    );
  }

  // Fallback loading state
  return <LoadingScreen isDark={isDark} toggleTheme={toggleTheme} />;
};

export default SurveyPage;
