"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Save,
  AlertCircle,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar"; // Import the Navbar component

const SurveyPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: unknown }>({});
  const [isLoading, setIsLoading] = useState(true);
  type Question = {
    id: number;
    type: "multiple_choice" | "single_choice" | "text" | "rating";
    question: string;
    options?: string[];
    scale?: number;
    placeholder?: string;
    required: boolean;
  };
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: boolean;
  }>({});

  // Timer states
  const [totalTimeLeft, setTotalTimeLeft] = useState(3600); // 60 minutes total
  const [timerActive, setTimerActive] = useState(true);
  const [timeSpent, setTimeSpent] = useState<{ [key: number]: number }>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Sample survey questions
  const sampleQuestions: Question[] = [
    {
      id: 1,
      type: "multiple_choice",
      question: "What is your current experience level with Data Science?",
      options: [
        "Complete Beginner",
        "Some Knowledge",
        "Intermediate",
        "Advanced",
        "Expert",
      ],
      required: true,
    },
    {
      id: 2,
      type: "single_choice",
      question: "What is your educational background?",
      options: [
        "High School",
        "Bachelor's Degree",
        "Master's Degree",
        "PhD",
        "Other",
      ],
      required: true,
    },
    {
      id: 3,
      type: "text",
      question: "What are your main goals for learning Data Science?",
      placeholder: "Please describe your learning objectives...",
      required: true,
    },
    {
      id: 4,
      type: "rating",
      question: "How would you rate your current programming skills?",
      scale: 5,
      required: true,
    },
    {
      id: 5,
      type: "multiple_choice",
      question:
        "Which areas of Data Science interest you most? (Select all that apply)",
      options: [
        "Machine Learning",
        "Data Analysis",
        "AI",
        "Statistics",
        "Data Visualization",
        "Big Data",
      ],
      required: true,
    },
    // Add more questions to reach 60
    ...Array.from({ length: 55 }, (_, i) => {
      const type: "multiple_choice" | "single_choice" | "text" | "rating" =
        i % 4 === 0
          ? "text"
          : i % 4 === 1
          ? "rating"
          : i % 4 === 2
          ? "single_choice"
          : "multiple_choice";
      return {
        id: i + 6,
        type,
        question: `Assessment Question ${
          i + 6
        }: What are your thoughts on data science topic ${i + 6}?`,
        options:
          type !== "text"
            ? [
                "Very Interested",
                "Interested",
                "Neutral",
                "Not Interested",
                "Not Applicable",
              ]
            : undefined,
        scale: type === "rating" ? 5 : undefined,
        placeholder:
          type === "text" ? "Please share your thoughts..." : undefined,
        required: i % 3 === 0,
      } as Question;
    }),
  ];

  // Load theme and questions on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }
    setQuestions(sampleQuestions);
    setIsLoading(false);
    setQuestionStartTime(Date.now());
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const submitSurvey = React.useCallback(async () => {
    // Track time spent on current question
    const timeSpentOnQuestion = Math.floor(
      (Date.now() - questionStartTime) / 1000
    );
    setTimeSpent((prev) => ({
      ...prev,
      [currentQuestion]: timeSpentOnQuestion,
    }));

    // Validate all required questions
    const errors: { [key: number]: boolean } = {};
    questions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id];
        const isValid =
          answer &&
          (typeof answer === "string"
            ? answer.trim() !== ""
            : Array.isArray(answer)
            ? answer.length > 0
            : answer !== null && answer !== undefined);
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
      const surveyData = {
        userId: "user_" + Date.now(),
        timestamp: new Date().toISOString(),
        answers: answers,
        timeSpent: timeSpent,
        totalTimeUsed: 3600 - totalTimeLeft,
        completedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Survey submitted:", surveyData);
      setShowSuccess(true);
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
  ]);

  const handleTimeUp = React.useCallback(() => {
    setTimerActive(false);
    alert("Time is up! Your survey will be submitted automatically.");
    submitSurvey();
  }, [submitSurvey]);

  // Main timer effect
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

  // Reset timer when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    const percentLeft = (totalTimeLeft / 3600) * 100;
    if (percentLeft <= 10) return isDark ? "text-red-400" : "text-red-600";
    if (percentLeft <= 25)
      return isDark ? "text-orange-400" : "text-orange-600";
    return isDark ? "text-emerald-400" : "text-emerald-600";
  };

  const getProgressBarColor = () => {
    const percentLeft = (totalTimeLeft / 3600) * 100;
    if (percentLeft <= 10) return "bg-red-500";
    if (percentLeft <= 25) return "bg-orange-500";
    return "bg-gradient-to-r from-emerald-600 to-green-600";
  };

  const handleAnswerChange = (
    questionId: number,
    value: string | number | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (validationErrors[questionId]) {
      setValidationErrors((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    }
  };

  const validateCurrentQuestion = () => {
    const question = questions[currentQuestion];
    if (!question.required) return true;

    const answer = answers[question.id];
    const isValid =
      answer &&
      (typeof answer === "string"
        ? answer.trim() !== ""
        : Array.isArray(answer)
        ? answer.length > 0
        : answer !== null && answer !== undefined);

    if (!isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        [question.id]: true,
      }));
    }

    return isValid;
  };

  const nextQuestion = () => {
    if (validateCurrentQuestion()) {
      // Track time spent on current question
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
    // Track time spent on current question
    const timeSpentOnQuestion = Math.floor(
      (Date.now() - questionStartTime) / 1000
    );
    setTimeSpent((prev) => ({
      ...prev,
      [currentQuestion]: timeSpentOnQuestion,
    }));

    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isLoading) {
    return (
      <div
        className={`h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className={`h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <div className="h-full flex items-center justify-center px-4">
          <div
            className={`max-w-md w-full p-8 rounded-2xl ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } shadow-xl text-center`}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Survey Completed!</h2>
            <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Thank you for completing our data science assessment survey. Your
              responses help us create a personalized learning path for your
              data science journey.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => (window.location.href = "/courses")}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                View Recommended Courses
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className={`w-full border-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  const renderQuestion = () => {
    if (!currentQ) return null;

    const hasError = validationErrors[currentQ.id];

    switch (currentQ.type) {
      case "multiple_choice":
        return (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {currentQ.options &&
              currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    Array.isArray(answers[currentQ.id]) &&
                    (answers[currentQ.id] as string[]).includes(option)
                      ? isDark
                        ? "bg-emerald-900/20 border-emerald-600"
                        : "bg-emerald-50 border-emerald-600"
                      : isDark
                      ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                      : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={
                      Array.isArray(answers[currentQ.id])
                        ? (answers[currentQ.id] as string[]).includes(option)
                        : false
                    }
                    onChange={(e) => {
                      const current = Array.isArray(answers[currentQ.id])
                        ? (answers[currentQ.id] as string[])
                        : [];
                      const newValue = e.target.checked
                        ? [...current, option]
                        : current.filter((item: string) => item !== option);
                      handleAnswerChange(currentQ.id, newValue);
                    }}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span
                    className={`ml-3 text-sm ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              ))}
          </div>
        );

      case "single_choice":
        return (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {currentQ.options &&
              currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    answers[currentQ.id] === option
                      ? isDark
                        ? "bg-emerald-900/20 border-emerald-600"
                        : "bg-emerald-50 border-emerald-600"
                      : isDark
                      ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                      : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question_${currentQ.id}`}
                    checked={answers[currentQ.id] === option}
                    onChange={() => handleAnswerChange(currentQ.id, option)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span
                    className={`ml-3 text-sm ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              ))}
          </div>
        );

      case "text":
        return (
          <textarea
            value={
              typeof answers[currentQ.id] === "string"
                ? (answers[currentQ.id] as string)
                : ""
            }
            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
            placeholder={currentQ.placeholder}
            className={`w-full p-3 rounded-lg border-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm ${
              hasError
                ? "border-red-500"
                : isDark
                ? "border-gray-600 focus:border-emerald-500"
                : "border-gray-300 focus:border-emerald-500"
            } ${
              isDark
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-white text-gray-900 placeholder-gray-500"
            }`}
            rows={3}
          />
        );

      case "rating":
        return (
          <div className="flex space-x-2">
            {[...Array(currentQ.scale)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleAnswerChange(currentQ.id, index + 1)}
                className={`w-10 h-10 rounded-full border-2 font-semibold transition-all text-sm ${
                  answers[currentQ.id] === index + 1
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-600"
                    : isDark
                    ? "border-gray-600 text-gray-300 hover:border-emerald-500"
                    : "border-gray-300 text-gray-700 hover:border-emerald-500"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`h-screen overflow-hidden flex flex-col ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Navbar */}
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <div className="flex-1 flex flex-col px-6 py-4 max-w-5xl mx-auto w-full pt-20">
        {/* Header Section - Compact */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Data Science Assessment Survey
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Help us understand your learning goals and background
            </p>
          </div>

          {/* Timer */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              isDark
                ? totalTimeLeft <= 600
                  ? "bg-red-900/30"
                  : "bg-gray-800"
                : totalTimeLeft <= 600
                ? "bg-red-100"
                : "bg-gray-100"
            }`}
          >
            <Clock className={`w-4 h-4 ${getTimerColor()}`} />
            <span className={`font-semibold text-sm ${getTimerColor()}`}>
              {formatTime(totalTimeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Section - Compact */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span
              className={`text-xs font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span
              className={`text-xs font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {Math.round(progress)}% Complete
            </span>
          </div>

          {/* Survey Progress Bar */}
          <div
            className={`w-full h-2 rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            } mb-1`}
          >
            <div
              className="h-2 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer Progress Bar */}
          <div
            className={`w-full h-1.5 rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-1.5 rounded-full transition-all duration-1000 ${getProgressBarColor()}`}
              style={{ width: `${(totalTimeLeft / 3600) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-1 text-xs">
            <span className={`${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Survey Progress
            </span>
            <span className={`${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Time Progress
            </span>
          </div>
        </div>

        {/* Question Card - Takes remaining space */}
        <div
          className={`flex-1 rounded-xl p-6 shadow-xl border transition-colors duration-300 flex flex-col ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="mb-4">
            <h2
              className={`text-xl font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {currentQ?.question}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              {currentQ?.required && (
                <span className="text-red-500 text-xs">* Required</span>
              )}
              {validationErrors[currentQ?.id] && (
                <div className="flex items-center space-x-1 text-red-500">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-xs">This question is required</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">{renderQuestion()}</div>
        </div>

        {/* Navigation - Fixed at bottom */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              currentQuestion === 0
                ? "opacity-50 cursor-not-allowed"
                : isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex space-x-3">
            <button
              onClick={() => {
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
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              <Save className="w-3 h-3" />
              Save
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={submitSurvey}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Survey
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-medium transition-all text-sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
