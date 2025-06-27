"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import SurveyHeader from "../components/SurveyHeader";
import SurveyProgress from "../components/SurveyProgress";
import QuestionCard from "../components/QuestionCard";
import Navigation from "../components/Navigation";
import SuccessScreen from "../components/SuccessScreen";
import LoadingScreen from "../components/LoadingScreen";
import InstructionsPopup from "../components/InstructionsPopup";

// Import quiz data and utilities
import quizData from "./questions.json";
import { QuizQuestion, SurveyQuestion } from "../types/quiz";
import { transformQuizToSurvey } from "../utils/transformQuestions";

const SurveyPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: unknown }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: boolean;
  }>({});
  const [totalTimeLeft, setTotalTimeLeft] = useState(3600);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState<{ [key: number]: number }>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);

  // New states for quiz functionality
  const [score, setScore] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setIsDark(savedTheme === "dark");

    // Transform and load questions
    const transformedQuestions = transformQuizToSurvey(
      quizData as QuizQuestion[]
    );

    // Option 1: Use all questions
    setQuestions(transformedQuestions);

    // Option 2: Get random selection (e.g., 20 questions with difficulty distribution)
    // const selectedQuestions = getRandomQuestions(transformedQuestions, 20, {
    //   easyCount: 8,
    //   mediumCount: 8,
    //   advancedCount: 4
    // });
    // setQuestions(selectedQuestions);

    // Option 3: Filter by role
    // const roleQuestions = filterQuestionsByRole(
    //   transformedQuestions,
    //   "Software Engineer / Developer"
    // );
    // setQuestions(roleQuestions);

    setIsLoading(false);
  }, []);

  const handleInstructionsAccepted = () => {
    setInstructionsAccepted(true);
    setTimerActive(true);
    setQuestionStartTime(Date.now());
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

  const calculateScore = useCallback(() => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (question.correctAnswer) {
        const userAnswer = answers[question.id];
        // Map the answer index to letter (0=a, 1=b, 2=c, 3=d)
        if (typeof userAnswer === "number" && question.options) {
          const answerLetter = String.fromCharCode(97 + userAnswer); // 97 is 'a'
          if (answerLetter === question.correctAnswer) {
            correctAnswers++;
          }
        }
      }
    });
    return correctAnswers;
  }, [answers, questions]);

  const submitSurvey = useCallback(async () => {
    const timeSpentOnQuestion = Math.floor(
      (Date.now() - questionStartTime) / 1000
    );
    setTimeSpent((prev) => ({
      ...prev,
      [currentQuestion]: timeSpentOnQuestion,
    }));

    const errors: { [key: number]: boolean } = {};
    questions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id];
        const isValid = answer !== null && answer !== undefined;
        if (!isValid) {
          errors[question.id] = true;
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

      const surveyData = {
        userId: "user_" + Date.now(),
        timestamp: new Date().toISOString(),
        answers,
        timeSpent,
        totalTimeUsed: 3600 - totalTimeLeft,
        completedAt: new Date().toISOString(),
        score: finalScore,
        totalQuestions: questions.length,
        percentage: Math.round((finalScore / questions.length) * 100),
        questionsByLevel: {
          easy: questions.filter((q) => q.level === "easy").length,
          medium: questions.filter((q) => q.level === "medium").length,
          advanced: questions.filter((q) => q.level === "advanced").length,
        },
      };

      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Survey submitted:", surveyData);
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
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
  ]);

  const handleTimeUp = useCallback(() => {
    setTimerActive(false);
    alert("Time is up! Your survey will be submitted automatically.");
    submitSurvey();
  }, [submitSurvey]);

  useEffect(() => {
    if (!timerActive || showSuccess || isLoading) return;

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
  }, [timerActive, showSuccess, isLoading, handleTimeUp]);

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

  if (isLoading)
    return <LoadingScreen isDark={isDark} toggleTheme={toggleTheme} />;

  // Update SuccessScreen to show score if needed
  if (showSuccess) {
    return (
      <SuccessScreen
        isDark={isDark}
        toggleTheme={toggleTheme}
        // Pass score data if your SuccessScreen supports it
        score={score}
        totalQuestions={questions.length}
        percentage={Math.round((score / questions.length) * 100)}
      />
    );
  }

  if (!instructionsAccepted) {
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

        {/* Add difficulty indicator */}
        {currentQ?.level && (
          <div
            className={`text-sm mb-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Difficulty:{" "}
            <span
              className={`font-semibold ${
                currentQ.level === "easy"
                  ? "text-green-500"
                  : currentQ.level === "medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {currentQ.level.charAt(0).toUpperCase() + currentQ.level.slice(1)}
            </span>
          </div>
        )}

        <QuestionCard
          question={currentQ}
          answer={answers[currentQ.id]}
          isDark={isDark}
          hasError={validationErrors[currentQ.id]}
          onAnswerChange={(questionId, value) => {
            setAnswers((prev) => ({ ...prev, [questionId]: value }));
            if (validationErrors[questionId]) {
              setValidationErrors((prev) => ({ ...prev, [questionId]: false }));
            }
          }}
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
};

export default SurveyPage;
