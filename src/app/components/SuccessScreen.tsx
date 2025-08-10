/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SuccessScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "./Navbar";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface SuccessScreenProps {
  isDark: boolean;
  toggleTheme: () => void;
  userId?: string;

  // Basic Score Data
  score?: number;
  totalQuestions?: number;
  percentage?: number;
  timeUsed?: number;
  questionsAttempted?: number;
  skippedQuestions?: number;

  // Question Breakdown
  questionsByLevel?: {
    easy: number;
    medium: number;
    advanced: number;
  };
  technicalQuestions?: number;
  qualitativeQuestions?: number;

  // Intent-Based Results
  intent?: string;
  intentConfidence?: number;
  reasoning?: string;
  recommendedPath?: string;

  // Career Insights
  targetRoles?: string[];
  qualitativeClusters?: string[];
  careerInsights?: string;
  skillGaps?: string[];
  suggestedLearningPath?: string[];
  focusAreas?: string[];

  // AI Metadata
  aiOptimized?: boolean;

  // Detailed question data for charts
  detailedQuestions?: Array<{
    id: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    category?: string;
    level?: string;
  }>;
}

interface GPTRecommendation {
  top_roles: string[];
  summary: string;
  recommendations: string[];
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  // toggleTheme,
  userId,
  score = 0,
  totalQuestions = 0,
  percentage = 0,
  timeUsed = 0,
  questionsAttempted = 0,
  skippedQuestions = 0,
  questionsByLevel,
  technicalQuestions = 0,
  qualitativeQuestions = 0,
  intent,
  intentConfidence = 0,
  reasoning,
  recommendedPath,
  targetRoles = [],
  qualitativeClusters = [],
  careerInsights,
  skillGaps = [],
  suggestedLearningPath = [],
  focusAreas = [],
  // aiOptimized = false,
  detailedQuestions = [],
}) => {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "detailed" | "recommendations" | "charts"
  >("overview");
  const [gptRecommendation, setGptRecommendation] =
    useState<GPTRecommendation | null>(null);
  const [isLoadingGPT, setIsLoadingGPT] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const isPassed = percentage >= 70;

  // Fetch GPT recommendations on mount
  useEffect(() => {
    const fetchGPTRecommendations = async () => {
      if (!userId) return;

      setIsLoadingGPT(true);
      try {
        const response = await fetch(`/api/getLatestResult?userId=${userId}`);
        const data = await response.json();

        if (data.gptResult) {
          setGptRecommendation(data.gptResult);
        }
      } catch (error) {
        console.error("Error fetching GPT recommendations:", error);
      } finally {
        setIsLoadingGPT(false);
      }
    };

    fetchGPTRecommendations();
  }, [userId]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getIntentDisplay = () => {
    const intentMap: {
      [key: string]: { label: string; icon: string; color: string };
    } = {
      career_switch: { label: "Career Switch", icon: "🔄", color: "blue" },
      skill_growth: { label: "Skill Growth", icon: "📈", color: "green" },
      confused: { label: "Career Exploration", icon: "🧭", color: "purple" },
    };
    return (
      intentMap[intent || ""] || {
        label: intent || "Unknown",
        icon: "❓",
        color: "gray",
      }
    );
  };

  // Chart Data Preparation
  const correctCount = detailedQuestions.filter((q) => q.isCorrect).length;
  const incorrectCount = detailedQuestions.length - correctCount;

  const accuracyChartData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Responses",
        data: [correctCount, incorrectCount],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderColor: ["#388E3C", "#D32F2F"],
        borderWidth: 2,
      },
    ],
  };

  const levelBreakdownData = questionsByLevel
    ? {
        labels: ["Easy", "Medium", "Advanced"],
        datasets: [
          {
            label: "Questions by Difficulty",
            data: [
              questionsByLevel.easy,
              questionsByLevel.medium,
              questionsByLevel.advanced,
            ],
            backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
            borderColor: ["#388E3C", "#F57C00", "#D32F2F"],
            borderWidth: 2,
          },
        ],
      }
    : null;

  const categoryBreakdownData = {
    labels: ["Technical", "Qualitative"],
    datasets: [
      {
        label: "Question Categories",
        data: [technicalQuestions, qualitativeQuestions],
        backgroundColor: ["#2196F3", "#9C27B0"],
        borderColor: ["#1976D2", "#7B1FA2"],
        borderWidth: 2,
      },
    ],
  };

  // Performance by category chart
  const categoryPerformanceData = () => {
    const categories: { [key: string]: { correct: number; total: number } } =
      {};

    detailedQuestions.forEach((q) => {
      const cat = q.category || "General";
      if (!categories[cat]) {
        categories[cat] = { correct: 0, total: 0 };
      }
      categories[cat].total++;
      if (q.isCorrect) categories[cat].correct++;
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          label: "Accuracy by Category (%)",
          data: Object.values(categories).map((c) =>
            Math.round((c.correct / c.total) * 100)
          ),
          backgroundColor: [
            "#4CAF50",
            "#2196F3",
            "#FF9800",
            "#9C27B0",
            "#00BCD4",
            "#795548",
            "#607D8B",
            "#E91E63",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDark ? "#ffffff" : "#374151",
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? "#ffffff" : "#374151",
        },
        grid: {
          color: isDark ? "#374151" : "#e5e7eb",
        },
      },
      x: {
        ticks: {
          color: isDark ? "#ffffff" : "#374151",
        },
        grid: {
          color: isDark ? "#374151" : "#e5e7eb",
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: isDark ? "#ffffff" : "#374151",
          padding: 20,
        },
      },
    },
  };

  // Export to PDF function
  const exportToPDF = async () => {
    const input = reportRef.current;
    if (!input) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `dhiti-ai-assessment-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Email report function
  const sendEmailReport = async () => {
    const input = reportRef.current;
    if (!input || !emailAddress) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBase64 = pdf.output("dataurlstring");

      const response = await fetch("/api/emailResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: emailAddress,
          pdfBase64,
          userName: `User ${userId}`,
          score: percentage,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Report sent successfully to your email!");
        setShowEmailModal(false);
        setEmailAddress("");
      } else {
        throw new Error(result.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const intentData = getIntentDisplay();

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      {/* <div
        className={`sticky top-0 z-10 ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Assessment Results
          </h1>
          <div className="flex items-center gap-4">
            {aiOptimized && (
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full">
                ✨ AI Optimized
              </span>
            )}
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
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Report Container for PDF Export */}
        <div
          ref={reportRef}
          className={`${
            isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
          }`}
        >
          {/* Success Icon & Score */}
          <div
            className={`text-center mb-8 p-8 rounded-2xl shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-center mb-6">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isPassed ? "bg-green-100" : "bg-yellow-100"
                }`}
              >
                <svg
                  className={`w-12 h-12 ${
                    isPassed ? "text-green-600" : "text-yellow-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isPassed ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  )}
                </svg>
              </div>
            </div>

            <h2
              className={`text-4xl font-bold mb-2 ${
                isPassed
                  ? isDark
                    ? "text-green-400"
                    : "text-green-600"
                  : isDark
                  ? "text-yellow-400"
                  : "text-yellow-600"
              }`}
            >
              {percentage}%
            </h2>

            <p
              className={`text-xl mb-4 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              You scored {score} out of {totalQuestions} questions
            </p>

            {intent && (
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <span className="text-2xl">{intentData.icon}</span>
                <span
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {intentData.label}
                </span>
                {intentConfidence > 0 && (
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    ({Math.round(intentConfidence * 100)}% confidence)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div
            className={`flex mb-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg p-1 shadow`}
          >
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "charts", label: "Charts & Analytics", icon: "📈" },
              { id: "detailed", label: "Detailed Analysis", icon: "🔍" },
              {
                id: "recommendations",
                label: "AI Recommendations",
                icon: "🤖",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all text-sm ${
                  activeTab === tab.id
                    ? isDark
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : isDark
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Performance Summary */}
              <div
                className={`p-6 rounded-xl shadow-lg ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Performance Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      Questions Attempted:
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {questionsAttempted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      Skipped:
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {skippedQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      Time Spent:
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {formatTime(timeUsed)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      Accuracy:
                    </span>
                    <span
                      className={`font-semibold ${
                        isPassed
                          ? isDark
                            ? "text-green-400"
                            : "text-green-600"
                          : isDark
                          ? "text-yellow-400"
                          : "text-yellow-600"
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Question Types */}
              <div
                className={`p-6 rounded-xl shadow-lg ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Question Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span
                      className={`flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      Technical
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {technicalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                      Qualitative
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {qualitativeQuestions}
                    </span>
                  </div>
                </div>

                <div className="mt-4 h-32">
                  <Doughnut data={categoryBreakdownData} options={pieOptions} />
                </div>
              </div>

              {/* Difficulty Levels */}
              {questionsByLevel && (
                <div
                  className={`p-6 rounded-xl shadow-lg ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Difficulty Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        className={`flex items-center gap-2 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        Easy
                      </span>
                      <span className="font-semibold text-green-500">
                        {questionsByLevel.easy}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`flex items-center gap-2 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        Medium
                      </span>
                      <span className="font-semibold text-yellow-500">
                        {questionsByLevel.medium}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`flex items-center gap-2 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        Advanced
                      </span>
                      <span className="font-semibold text-red-500">
                        {questionsByLevel.advanced}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "charts" && (
            <div className="space-y-8">
              {/* Response Accuracy Chart */}
              <div
                className={`p-6 rounded-xl shadow-lg ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  📈 Response Accuracy
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <Pie data={accuracyChartData} options={pieOptions} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                        <span className="flex items-center gap-2 text-green-800">
                          <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                          Correct Answers
                        </span>
                        <span className="font-bold text-green-800">
                          {correctCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                        <span className="flex items-center gap-2 text-red-800">
                          <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                          Incorrect Answers
                        </span>
                        <span className="font-bold text-red-800">
                          {incorrectCount}
                        </span>
                      </div>
                      <div className="text-center pt-4">
                        <span
                          className={`text-2xl font-bold ${
                            isPassed ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {percentage}% Accuracy
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Performance */}
              {detailedQuestions.length > 0 && (
                <div
                  className={`p-6 rounded-xl shadow-lg ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    📊 Performance by Category
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={categoryPerformanceData()}
                      options={chartOptions}
                    />
                  </div>
                </div>
              )}

              {/* Difficulty Distribution */}
              {levelBreakdownData && (
                <div
                  className={`p-6 rounded-xl shadow-lg ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    🎯 Questions by Difficulty Level
                  </h3>
                  <div className="h-64">
                    <Bar data={levelBreakdownData} options={chartOptions} />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "detailed" && (
            <div className="space-y-6">
              {/* Intent Analysis */}
              {reasoning && (
                <div
                  className={`p-6 rounded-xl shadow-lg ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    🧠 Intent Analysis
                  </h3>
                  <p
                    className={`mb-4 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {reasoning}
                  </p>
                  {recommendedPath && (
                    <div
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-blue-50"
                      }`}
                    >
                      <h4
                        className={`font-semibold mb-2 ${
                          isDark ? "text-blue-400" : "text-blue-800"
                        }`}
                      >
                        Recommended Path:
                      </h4>
                      <p className={isDark ? "text-gray-300" : "text-blue-700"}>
                        {recommendedPath}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Target Roles & Clusters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {targetRoles.length > 0 && (
                  <div
                    className={`p-6 rounded-xl shadow-lg ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold mb-4 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      🎯 Target Roles Assessed
                    </h3>
                    <div className="space-y-2">
                      {targetRoles.map((role, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            isDark ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {qualitativeClusters.length > 0 && (
                  <div
                    className={`p-6 rounded-xl shadow-lg ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold mb-4 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      🧭 Skills Clusters Evaluated
                    </h3>
                    <div className="space-y-2">
                      {qualitativeClusters.map((cluster, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            isDark ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {cluster}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "recommendations" && (
            <div className="space-y-6">
              {/* GPT Recommendations */}
              {isLoadingGPT ? (
                <div
                  className={`p-8 rounded-xl shadow-lg text-center ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    🤖 AI is analyzing your performance and generating
                    personalized recommendations...
                  </p>
                </div>
              ) : gptRecommendation ? (
                <>
                  {/* AI Summary */}
                  <div
                    className={`p-6 rounded-xl shadow-lg ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold mb-4 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      🤖 AI Performance Summary
                    </h3>
                    <p
                      className={`whitespace-pre-line ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {gptRecommendation.summary}
                    </p>
                  </div>

                  {/* Top Role Recommendations */}
                  <div
                    className={`p-6 rounded-xl shadow-lg ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold mb-4 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      🎯 Top Role Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gptRecommendation.top_roles.map((role, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 border-dashed ${
                            isDark
                              ? "border-gray-600 bg-gray-700"
                              : "border-gray-300 bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">💼</span>
                            <span
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-blue-800"
                              }`}
                            >
                              {role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Learning Recommendations */}
                  <div
                    className={`p-6 rounded-xl shadow-lg ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold mb-4 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      📚 AI Learning Recommendations
                    </h3>
                    <div className="space-y-4">
                      {gptRecommendation.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-4 p-4 rounded-lg ${
                            isDark ? "bg-green-900/20" : "bg-green-50"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isDark
                                ? "bg-green-600 text-white"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {rec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`p-8 rounded-xl shadow-lg text-center ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    AI recommendations are currently unavailable. Please check
                    back later.
                  </p>
                </div>
              )}

              {/* Manual Career Insights */}
              {careerInsights && (
                <div
                  className={`p-6 rounded-xl shadow-lg ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    💡 Career Insights
                  </h3>
                  <p
                    className={`whitespace-pre-line ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {careerInsights}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skill Gaps */}
                {skillGaps.length > 0 && (
                  <div
                    className={`p-6 rounded-xl shadow-lg ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold mb-4 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      🔍 Areas for Improvement
                    </h3>
                    <div className="space-y-3">
                      {skillGaps.map((gap, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            isDark ? "bg-red-900/20" : "bg-red-50"
                          }`}
                        >
                          <span className="text-red-500 mt-1">⚠️</span>
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {gap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Focus Areas */}
                {focusAreas.length > 0 && (
                  <div
                    className={`p-6 rounded-xl shadow-lg ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold mb-4 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      🎯 Focus Areas
                    </h3>
                    <div className="space-y-3">
                      {focusAreas.map((area, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            isDark ? "bg-blue-900/20" : "bg-blue-50"
                          }`}
                        >
                          <span className="text-blue-500 mt-1">🎯</span>
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {area}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Learning Path */}
              {suggestedLearningPath.length > 0 && (
                <div
                  className={`p-6 rounded-xl shadow-lg ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    📚 Suggested Learning Path
                  </h3>
                  <div className="space-y-4">
                    {suggestedLearningPath.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-4 p-4 rounded-lg ${
                          isDark ? "bg-green-900/20" : "bg-green-50"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isDark
                              ? "bg-green-600 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span
                          className={isDark ? "text-gray-300" : "text-gray-700"}
                        >
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons - Outside PDF container */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center mt-8 p-6 rounded-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              isDark
                ? "bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300"
            }`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Generating PDF...
              </>
            ) : (
              <>📄 Download Report</>
            )}
          </button>

          <button
            onClick={() => setShowEmailModal(true)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            📧 Email Results
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isPassed
                ? isDark
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-500 text-white hover:bg-green-600"
                : isDark
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            🏠 Back to Home
          </button>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`max-w-md w-full mx-4 p-6 rounded-xl shadow-xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Email Assessment Report
            </h3>

            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                }`}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={sendEmailReport}
                disabled={!emailAddress || isExporting}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Sending...
                  </>
                ) : (
                  "Send Report"
                )}
              </button>

              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailAddress("");
                }}
                className={`px-4 py-2 rounded-lg border ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessScreen;
