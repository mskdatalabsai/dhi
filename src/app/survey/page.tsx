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
  countsTowardScore: boolean; // NEW: Whether this question affects the score
  timeSpent: number;
  answeredAt: Date | null;
  wasChanged: boolean;
  isQualitative?: boolean;
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

      if (questions.length === 0) {
        throw new Error("No questions found for your profile configuration");
      }

      setQuestions(questions);
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

      console.log(
        `✅ Loaded ${questions.length} questions for intent: ${intent.intent}`
      );
      console.log(`Intent reasoning: ${intent.reasoning}`);
      console.log(`Recommended path: ${intent.recommendedPath}`);

      if (intent.recommendedPath) {
        console.log("Assessment customized for:", intent.recommendedPath);
      }
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
  };

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

  // Updated prepareDetailedQuestions to mark scoring status
  const prepareDetailedQuestions = useCallback(() => {
    const detailed: DetailedQuestion[] = questions.map((question, index) => {
      const userAnswerIndex = answers[question.id];
      const userAnswer =
        typeof userAnswerIndex === "number"
          ? String.fromCharCode(97 + userAnswerIndex)
          : null;

      // Only calculate isCorrect for technical questions
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
        userAnswer,
        isCorrect,
        countsTowardScore, // NEW: Flag to indicate if this question affects score
        timeSpent: timeSpent[index] || 0,
        answeredAt: userAnswer ? new Date() : null,
        wasChanged: answerChanges[question.id] || false,
        isQualitative: question.isQualitative || false,
      };
    });

    return detailed;
  }, [questions, answers, timeSpent, answerChanges]);

  // Updated calculateScore function for technical questions only
  const calculateScore = useCallback(() => {
    let correctAnswers = 0;
    let technicalQuestionsCount = 0;

    questions.forEach((question) => {
      // Only score technical questions
      if (question.correctAnswer && !question.isQualitative) {
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

    // Store technical questions count for percentage calculation
    setAssessmentMetadata((prev: any) => ({
      ...prev,
      actualTechnicalCount: technicalQuestionsCount,
    }));

    return correctAnswers;
  }, [answers, questions]);

  // Modified submit survey function with technical-only scoring
  const submitSurvey = useCallback(async () => {
    const timeSpentOnQuestion = Math.floor(
      (Date.now() - questionStartTime) / 1000
    );
    setTimeSpent((prev) => ({
      ...prev,
      [currentQuestion]: timeSpentOnQuestion,
    }));

    const errors: { [key: number]: boolean } = {};
    let skippedCount = 0;

    questions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id];
        const isValid = answer !== null && answer !== undefined;
        if (!isValid) {
          errors[question.id] = true;
          skippedCount++;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstErrorIndex = questions.findIndex((q) => errors[q.id]);
      setCurrentQuestion(firstErrorIndex);
      return;
    }

    setIsSubmitting(true);
    setTimerActive(false);

    try {
      const finalScore = calculateScore();
      setScore(finalScore);

      const detailedQuestionsData = prepareDetailedQuestions();
      setDetailedQuestions(detailedQuestionsData);

      const questionsAttempted = Object.keys(answers).length;

      // Calculate technical vs qualitative breakdown
      const technicalQuestions = questions.filter((q) => !q.isQualitative);
      const qualitativeQuestions = questions.filter((q) => q.isQualitative);
      const technicalQuestionsCount = technicalQuestions.length;
      const qualitativeQuestionsCount = qualitativeQuestions.length;

      // Calculate percentage based ONLY on technical questions
      const technicalPercentage =
        technicalQuestionsCount > 0
          ? Math.round((finalScore / technicalQuestionsCount) * 100)
          : 0;

      // Prepare survey data with technical-only scoring
      const surveyData = {
        // Basic survey data - Updated scoring logic
        startedAt: surveyStartTime,
        totalTimeUsed: 3600 - totalTimeLeft,
        score: finalScore, // Only technical questions
        totalQuestions: questions.length, // All questions
        technicalQuestionsTotal: technicalQuestionsCount, // NEW: Total technical questions
        qualitativeQuestionsTotal: qualitativeQuestionsCount, // NEW: Total qualitative questions
        questionsAttempted,
        skippedQuestions: questions.length - questionsAttempted,
        percentage: technicalPercentage, // Percentage based ONLY on technical questions

        // Scoring metadata (NEW)
        scoringMethod: "technical_only",
        scoredQuestionsCount: technicalQuestionsCount,
        analysisOnlyQuestionsCount: qualitativeQuestionsCount,

        // Detailed questions data
        questions: detailedQuestionsData,

        // Timing and interaction data
        timeSpent,
        answers,

        // Intent-based metadata
        assessmentType: "intent-based",
        intent: assessmentMetadata.intent,
        intentConfidence: assessmentMetadata.intentConfidence,
        reasoning: assessmentMetadata.reasoning,
        recommendedPath: assessmentMetadata.recommendedPath,

        // Question breakdown - Updated with actual counts
        technicalQuestions: technicalQuestionsCount,
        qualitativeQuestions: qualitativeQuestionsCount,
        questionsByLevel: {
          easy: technicalQuestions.filter((q) => q.level === "easy").length,
          medium: technicalQuestions.filter((q) => q.level === "medium").length,
          advanced: technicalQuestions.filter((q) => q.level === "advanced")
            .length,
        },

        // Qualitative breakdown for analysis (NEW)
        qualitativeBreakdown: {
          easy: qualitativeQuestions.filter((q) => q.level === "easy").length,
          medium: qualitativeQuestions.filter((q) => q.level === "medium")
            .length,
          advanced: qualitativeQuestions.filter((q) => q.level === "advanced")
            .length,
        },

        targetRoles: assessmentMetadata.technicalBreakdown?.byRole || [],
        qualitativeClusters:
          assessmentMetadata.qualitativeBreakdown?.clusters || [],

        // AI insights
        careerInsights: assessmentMetadata.careerInsights,
        skillGaps: assessmentMetadata.skillGaps,
        suggestedLearningPath: assessmentMetadata.suggestedLearningPath,
        aiOptimized: assessmentMetadata.aiOptimized || false,
        focusAreas: assessmentMetadata.focusAreas,

        // System metadata
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

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

        // Updated success message to clarify scoring
        const successMessage = `🎉 Assessment completed successfully!

Technical Score: ${surveyData.percentage}% (${finalScore}/${technicalQuestionsCount} technical questions)
Qualitative Questions: ${qualitativeQuestionsCount} completed for analysis

Redirecting to your detailed results...`;
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

  const validateCurrentQuestion = () => {
    const question = questions[currentQuestion];
    if (!question.required) return true;

    const answer = answers[question.id];
    const isValid = answer !== null && answer !== undefined;

    if (!isValid) {
      setValidationErrors((prev) => ({ ...prev, [question.id]: true }));
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
      setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
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
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
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

          {/* Assessment info - Updated to show scoring info */}
          <div
            className={`text-xs mb-2 flex justify-between ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <span>
              Intent: {userIntent.intent} | Tech:{" "}
              {questions.filter((q) => !q.isQualitative).length} (scored) |
              Behavioral: {questions.filter((q) => q.isQualitative).length}{" "}
              (analysis)
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
