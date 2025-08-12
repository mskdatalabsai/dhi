/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SuccessScreen.tsx - Modern Professional Redesign
import React, { useState, useRef, useEffect } from "react";
import { Pie, Doughnut, Bar, Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Filler,
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
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Filler
);

interface SuccessScreenProps {
  isDark: boolean;
  toggleTheme: () => void;
  userId?: string;
  detailedQuestions?: Array<{
    id: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    category?: string;
    level?: string;
    countsTowardScore?: boolean;
    isQualitative?: boolean;
  }>;
  score?: number;
  totalQuestions?: number;
  percentage?: number;
  timeUsed?: number;
  questionsAttempted?: number;
  skippedQuestions?: number;
  questionsByLevel?: {
    easy: number;
    medium: number;
    advanced: number;
  };
  qualitativeBreakdown?: {
    easy: number;
    medium: number;
    advanced: number;
  };
  technicalQuestions?: number;
  qualitativeQuestions?: number;
  intent?: string;
  intentConfidence?: number;
  reasoning?: string;
  recommendedPath?: string;
  targetRoles?: string[];
  qualitativeClusters?: string[];
  careerInsights?: string;
  skillGaps?: string[];
  suggestedLearningPath?: string[];
  focusAreas?: string[];
  aiOptimized?: boolean;
  allQuestionsCount?: number;
  qualitativeQuestionsData?: Array<{
    id: string;
    question: string;
    userAnswer: string;
    category?: string;
    level?: string;
  }>;
}

interface GPTRecommendation {
  summary: string;
  top_roles: string[];
  recommendations: string[];
  skill_analysis?: {
    strengths: string[];
    improvement_areas: string[];
    learning_priority: string[];
  };
  career_insights?: {
    immediate_next_steps: string[];
    long_term_goals: string[];
    industry_trends: string[];
  };
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  isDark: propIsDark,
  toggleTheme: propToggleTheme,
  userId,
  score = 0,
  totalQuestions = 0,
  percentage = 0,
  timeUsed = 0,
  questionsAttempted = 0,
  skippedQuestions = 0,
  questionsByLevel,
  qualitativeBreakdown,
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
  aiOptimized = false,
  detailedQuestions = [],
  allQuestionsCount = 0,
  qualitativeQuestionsData = [],
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [gptRecommendation, setGptRecommendation] =
    useState<GPTRecommendation | null>(null);
  const [isLoadingGPT, setIsLoadingGPT] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState<boolean[]>([]);

  const reportRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);

  const isPassed = percentage >= 70;

  const technicalQuestionsOnly = detailedQuestions.filter(
    (q) => !q.isQualitative && q.countsTowardScore
  );

  // Handle scroll progress and section visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = (scrollY / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);

      // Check which sections are visible
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const isInView =
            rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2;
          if (isInView) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate sections on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Fetch GPT recommendations
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
      [key: string]: { label: string; icon: string; gradient: string };
    } = {
      career_switch: {
        label: "Career Switch",
        icon: "🔄",
        gradient: "from-purple-500 to-pink-500",
      },
      skill_growth: {
        label: "Skill Growth",
        icon: "📈",
        gradient: "from-blue-500 to-cyan-500",
      },
      confused: {
        label: "Career Exploration",
        icon: "🧭",
        gradient: "from-indigo-500 to-purple-500",
      },
    };
    return (
      intentMap[intent || ""] || {
        label: intent || "Unknown",
        icon: "❓",
        gradient: "from-gray-500 to-gray-600",
      }
    );
  };

  // Chart Data
  const correctCount = technicalQuestionsOnly.filter((q) => q.isCorrect).length;
  const incorrectCount = technicalQuestionsOnly.length - correctCount;

  const performanceRadarData = {
    labels: [
      "Technical Skills",
      "Problem Solving",
      "Time Management",
      "Accuracy",
      "Completion Rate",
    ],
    datasets: [
      {
        label: "Your Performance",
        data: [
          percentage,
          (correctCount / technicalQuestionsOnly.length) * 100 || 0,
          Math.min(100, (3600 / timeUsed) * 100), // Inverse time score
          percentage,
          (questionsAttempted / allQuestionsCount) * 100,
        ],
        backgroundColor: propIsDark
          ? "rgba(168, 85, 247, 0.2)"
          : "rgba(168, 85, 247, 0.2)",
        borderColor: propIsDark ? "#a855f7" : "#a855f7",
        pointBackgroundColor: propIsDark ? "#a855f7" : "#a855f7",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: propIsDark ? "#a855f7" : "#a855f7",
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: propIsDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        grid: {
          color: propIsDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          color: propIsDark ? "#e5e7eb" : "#374151",
          font: {
            size: 11,
          },
        },
        ticks: {
          color: propIsDark ? "#9ca3af" : "#6b7280",
          backdropColor: "transparent",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const accuracyDoughnutData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [correctCount, incorrectCount],
        backgroundColor: propIsDark
          ? ["rgba(168, 85, 247, 0.8)", "rgba(239, 68, 68, 0.3)"]
          : ["rgba(168, 85, 247, 0.8)", "rgba(239, 68, 68, 0.3)"],
        borderColor: propIsDark
          ? ["#a855f7", "rgba(239, 68, 68, 0.5)"]
          : ["#a855f7", "rgba(239, 68, 68, 0.5)"],
        borderWidth: 2,
      },
    ],
  };

  const levelProgressData = questionsByLevel
    ? {
        labels: ["Easy", "Medium", "Advanced"],
        datasets: [
          {
            label: "Questions",
            data: [
              questionsByLevel.easy,
              questionsByLevel.medium,
              questionsByLevel.advanced,
            ],
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)",
              "rgba(251, 146, 60, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ],
          },
        ],
      }
    : null;

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: propIsDark ? "#e5e7eb" : "#374151",
          padding: 15,
          font: { size: 12 },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: propIsDark ? "#9ca3af" : "#6b7280" },
        grid: {
          color: propIsDark
            ? "rgba(75, 85, 99, 0.3)"
            : "rgba(229, 231, 235, 0.5)",
        },
      },
      x: {
        ticks: { color: propIsDark ? "#9ca3af" : "#6b7280" },
        grid: { display: false },
      },
    },
  };

  const exportToPDF = async () => {
    const input = reportRef.current;
    if (!input) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: propIsDark ? "#111827" : "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `dhiti-assessment-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  const intentData = getIntentDisplay();

  const sections = [
    { id: "hero", icon: "🏆", label: "Score" },
    { id: "performance", icon: "📊", label: "Performance" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "insights", icon: "🧠", label: "Insights" },
    { id: "recommendations", icon: "🤖", label: "AI Analysis" },
    { id: "roadmap", icon: "🗺️", label: "Roadmap" },
  ];

  return (
    <div
      className={`min-h-screen ${propIsDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Fixed Navbar with working theme toggle */}
      <Navbar isDark={propIsDark} toggleTheme={propToggleTheme} />

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-800 z-40">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Side Navigation */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
        <div
          className={`${
            propIsDark ? "bg-gray-800/90" : "bg-white/90"
          } backdrop-blur-md rounded-2xl p-4 shadow-2xl border ${
            propIsDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(index)}
              className={`block w-full text-left mb-4 last:mb-0 transition-all group ${
                activeSection === index ? "scale-110" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeSection === index
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg"
                      : propIsDark
                      ? "bg-gray-700 text-gray-400 group-hover:text-white"
                      : "bg-gray-100 text-gray-600 group-hover:text-gray-900"
                  }`}
                >
                  <span className="text-sm">{section.icon}</span>
                </div>
                <span
                  className={`text-xs font-medium hidden xl:block ${
                    activeSection === index
                      ? propIsDark
                        ? "text-white"
                        : "text-gray-900"
                      : propIsDark
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  {section.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div ref={reportRef}>
          {/* Section 1: Hero Score */}
          <section
            ref={(el) => {
              sectionRefs.current[0] = el as HTMLDivElement;
            }}
            className="min-h-screen flex items-center justify-center py-20"
          >
            <div className="w-full">
              <div
                className={`relative overflow-hidden rounded-3xl ${
                  propIsDark
                    ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
                    : "bg-gradient-to-br from-white via-gray-50 to-gray-100"
                } p-12 shadow-2xl`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10"></div>

                {/* Animated Background Circles */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="relative z-10">
                  <div className="text-center">
                    {/* Animated Score Display */}
                    <div className="inline-block mb-8">
                      <div className="relative">
                        <svg className="w-48 h-48 transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke={
                              propIsDark
                                ? "rgba(75, 85, 99, 0.3)"
                                : "rgba(229, 231, 235, 0.5)"
                            }
                            strokeWidth="12"
                            fill="none"
                          />
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 88}`}
                            strokeDashoffset={`${
                              2 * Math.PI * 88 * (1 - percentage / 100)
                            }`}
                            className="transition-all duration-1000"
                          />
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div>
                            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                              {percentage}%
                            </div>
                            <div
                              className={`text-sm ${
                                propIsDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Technical Score
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h1
                      className={`text-4xl md:text-5xl font-bold mb-4 ${
                        propIsDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Assessment Complete! 🎉
                    </h1>

                    <p
                      className={`text-xl mb-6 ${
                        propIsDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      You scored{" "}
                      <span className="font-bold text-purple-500">{score}</span>{" "}
                      out of{" "}
                      <span className="font-bold text-cyan-500">
                        {totalQuestions}
                      </span>{" "}
                      technical questions
                    </p>

                    {/* Intent Badge */}
                    {intent && (
                      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-500/30 mb-8">
                        <span className="text-2xl">{intentData.icon}</span>
                        <div>
                          <div
                            className={`font-semibold ${
                              propIsDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {intentData.label}
                          </div>
                          {intentConfidence > 0 && (
                            <div
                              className={`text-xs ${
                                propIsDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {Math.round(intentConfidence * 100)}% confidence
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Questions",
                          value: allQuestionsCount,
                          icon: "📝",
                          color: "purple",
                        },
                        {
                          label: "Time Spent",
                          value: formatTime(timeUsed),
                          icon: "⏱️",
                          color: "cyan",
                        },
                        {
                          label: "Attempted",
                          value: questionsAttempted,
                          icon: "✅",
                          color: "green",
                        },
                        {
                          label: "AI Optimized",
                          value: aiOptimized ? "Yes" : "No",
                          icon: "✨",
                          color: "pink",
                        },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className={`${
                            propIsDark ? "bg-gray-800/50" : "bg-white/50"
                          } backdrop-blur-sm rounded-2xl p-4 border ${
                            propIsDark ? "border-gray-700" : "border-gray-200"
                          } transform hover:scale-105 transition-all`}
                        >
                          <div className="text-2xl mb-2">{stat.icon}</div>
                          <div
                            className={`text-2xl font-bold bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 bg-clip-text text-transparent`}
                          >
                            {stat.value}
                          </div>
                          <div
                            className={`text-xs ${
                              propIsDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Performance Overview */}
          <section
            ref={(el) => {
              if (el) sectionRefs.current[1] = el;
            }}
            className="min-h-screen py-20"
          >
            <div className="mb-12">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  propIsDark ? "text-white" : "text-gray-900"
                }`}
              >
                Performance Overview
              </h2>
              <p
                className={`${propIsDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Comprehensive analysis of your assessment performance
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <div
                className={`${
                  propIsDark ? "bg-gray-800/50" : "bg-white"
                } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                  propIsDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    propIsDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Skills Radar
                </h3>
                <div className="h-80">
                  <Radar data={performanceRadarData} options={radarOptions} />
                </div>
              </div>

              {/* Accuracy Doughnut */}
              <div
                className={`${
                  propIsDark ? "bg-gray-800/50" : "bg-white"
                } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                  propIsDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    propIsDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Answer Accuracy
                </h3>
                <div className="h-80">
                  <Doughnut
                    data={accuracyDoughnutData}
                    options={doughnutOptions}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div
                    className={`text-center p-3 rounded-xl ${
                      propIsDark ? "bg-green-900/20" : "bg-green-50"
                    }`}
                  >
                    <div className="text-2xl font-bold text-green-500">
                      {correctCount}
                    </div>
                    <div
                      className={`text-xs ${
                        propIsDark ? "text-green-400" : "text-green-700"
                      }`}
                    >
                      Correct
                    </div>
                  </div>
                  <div
                    className={`text-center p-3 rounded-xl ${
                      propIsDark ? "bg-red-900/20" : "bg-red-50"
                    }`}
                  >
                    <div className="text-2xl font-bold text-red-500">
                      {incorrectCount}
                    </div>
                    <div
                      className={`text-xs ${
                        propIsDark ? "text-red-400" : "text-red-700"
                      }`}
                    >
                      Incorrect
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Distribution */}
            <div
              className={`mt-8 ${
                propIsDark ? "bg-gray-800/50" : "bg-white"
              } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                propIsDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-6 ${
                  propIsDark ? "text-white" : "text-gray-900"
                }`}
              >
                Question Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className={`p-6 rounded-2xl ${
                    propIsDark
                      ? "bg-gradient-to-br from-purple-900/20 to-purple-800/20"
                      : "bg-gradient-to-br from-purple-50 to-purple-100"
                  } border ${
                    propIsDark ? "border-purple-700" : "border-purple-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-sm font-medium ${
                        propIsDark ? "text-purple-400" : "text-purple-700"
                      }`}
                    >
                      Technical Questions
                    </span>
                    <span className="text-2xl">💻</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-500">
                    {technicalQuestions}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      propIsDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    Scored for assessment
                  </div>
                </div>

                <div
                  className={`p-6 rounded-2xl ${
                    propIsDark
                      ? "bg-gradient-to-br from-cyan-900/20 to-cyan-800/20"
                      : "bg-gradient-to-br from-cyan-50 to-cyan-100"
                  } border ${
                    propIsDark ? "border-cyan-700" : "border-cyan-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-sm font-medium ${
                        propIsDark ? "text-cyan-400" : "text-cyan-700"
                      }`}
                    >
                      Qualitative Questions
                    </span>
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="text-3xl font-bold text-cyan-500">
                    {qualitativeQuestions}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      propIsDark ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  >
                    For career analysis
                  </div>
                </div>

                <div
                  className={`p-6 rounded-2xl ${
                    propIsDark
                      ? "bg-gradient-to-br from-green-900/20 to-green-800/20"
                      : "bg-gradient-to-br from-green-50 to-green-100"
                  } border ${
                    propIsDark ? "border-green-700" : "border-green-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-sm font-medium ${
                        propIsDark ? "text-green-400" : "text-green-700"
                      }`}
                    >
                      Completion Rate
                    </span>
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="text-3xl font-bold text-green-500">
                    {Math.round((questionsAttempted / allQuestionsCount) * 100)}
                    %
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      propIsDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {questionsAttempted} of {allQuestionsCount}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Analytics */}
          <section
            ref={(el) => {
              if (el) sectionRefs.current[2] = el;
            }}
            className="min-h-screen py-20"
          >
            <div className="mb-12">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  propIsDark ? "text-white" : "text-gray-900"
                }`}
              >
                Detailed Analytics
              </h2>
              <p
                className={`${propIsDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Deep dive into your performance metrics
              </p>
            </div>

            {levelProgressData && (
              <div
                className={`${
                  propIsDark ? "bg-gray-800/50" : "bg-white"
                } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                  propIsDark ? "border-gray-700" : "border-gray-200"
                } mb-8`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    propIsDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Difficulty Level Performance
                </h3>
                <div className="h-64">
                  <Bar data={levelProgressData} options={barOptions} />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div
                    className={`text-center p-4 rounded-xl ${
                      propIsDark ? "bg-green-900/20" : "bg-green-50"
                    }`}
                  >
                    <div className="text-xl font-bold text-green-500">
                      {questionsByLevel?.easy || 0}
                    </div>
                    <div
                      className={`text-sm ${
                        propIsDark ? "text-green-400" : "text-green-700"
                      }`}
                    >
                      Easy
                    </div>
                  </div>
                  <div
                    className={`text-center p-4 rounded-xl ${
                      propIsDark ? "bg-yellow-900/20" : "bg-yellow-50"
                    }`}
                  >
                    <div className="text-xl font-bold text-yellow-500">
                      {questionsByLevel?.medium || 0}
                    </div>
                    <div
                      className={`text-sm ${
                        propIsDark ? "text-yellow-400" : "text-yellow-700"
                      }`}
                    >
                      Medium
                    </div>
                  </div>
                  <div
                    className={`text-center p-4 rounded-xl ${
                      propIsDark ? "bg-red-900/20" : "bg-red-50"
                    }`}
                  >
                    <div className="text-xl font-bold text-red-500">
                      {questionsByLevel?.advanced || 0}
                    </div>
                    <div
                      className={`text-sm ${
                        propIsDark ? "text-red-400" : "text-red-700"
                      }`}
                    >
                      Advanced
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Section 4: Career Insights */}
          <section
            ref={(el) => {
              if (el) sectionRefs.current[3] = el;
            }}
            className="min-h-screen py-20"
          >
            <div className="mb-12">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  propIsDark ? "text-white" : "text-gray-900"
                }`}
              >
                Career Insights
              </h2>
              <p
                className={`${propIsDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Personalized career guidance based on your assessment
              </p>
            </div>

            {reasoning && (
              <div
                className={`${
                  propIsDark ? "bg-gray-800/50" : "bg-white"
                } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                  propIsDark ? "border-gray-700" : "border-gray-200"
                } mb-8`}
              >
                <h3
                  className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                    propIsDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <span className="text-purple-500">🧠</span> Intent Analysis
                </h3>
                <p
                  className={`${
                    propIsDark ? "text-gray-300" : "text-gray-700"
                  } leading-relaxed`}
                >
                  {reasoning}
                </p>
                {recommendedPath && (
                  <div
                    className={`mt-6 p-6 rounded-2xl ${
                      propIsDark
                        ? "bg-gradient-to-r from-purple-900/20 to-cyan-900/20"
                        : "bg-gradient-to-r from-purple-50 to-cyan-50"
                    } border ${
                      propIsDark ? "border-purple-700" : "border-purple-200"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 ${
                        propIsDark ? "text-purple-400" : "text-purple-700"
                      }`}
                    >
                      Recommended Path:
                    </h4>
                    <p
                      className={`${
                        propIsDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {recommendedPath}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {targetRoles.length > 0 && (
                <div
                  className={`${
                    propIsDark ? "bg-gray-800/50" : "bg-white"
                  } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                    propIsDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-6 ${
                      propIsDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    🎯 Target Roles
                  </h3>
                  <div className="space-y-3">
                    {targetRoles.map((role, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl ${
                          propIsDark ? "bg-gray-700/50" : "bg-gray-50"
                        } border ${
                          propIsDark ? "border-gray-600" : "border-gray-200"
                        } transform hover:scale-105 transition-all`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <span
                            className={`${
                              propIsDark ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {qualitativeClusters.length > 0 && (
                <div
                  className={`${
                    propIsDark ? "bg-gray-800/50" : "bg-white"
                  } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                    propIsDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-6 ${
                      propIsDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    🧭 Skills Clusters
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {qualitativeClusters.map((cluster, index) => (
                      <span
                        key={index}
                        className={`px-4 py-2 rounded-full ${
                          propIsDark
                            ? "bg-gradient-to-r from-purple-900/30 to-cyan-900/30"
                            : "bg-gradient-to-r from-purple-100 to-cyan-100"
                        } border ${
                          propIsDark ? "border-purple-700" : "border-purple-300"
                        } text-sm font-medium ${
                          propIsDark ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        {cluster}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 5: AI Recommendations */}
          <section
            ref={(el) => {
              if (el) sectionRefs.current[4] = el;
            }}
            className="min-h-screen py-20"
          >
            <div className="mb-12">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  propIsDark ? "text-white" : "text-gray-900"
                }`}
              >
                AI-Powered Recommendations
              </h2>
              <p
                className={`${propIsDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Personalized insights generated by advanced AI
              </p>
            </div>

            {isLoadingGPT ? (
              <div
                className={`${
                  propIsDark ? "bg-gray-800/50" : "bg-white"
                } backdrop-blur-sm rounded-3xl p-16 shadow-xl border ${
                  propIsDark ? "border-gray-700" : "border-gray-200"
                } text-center`}
              >
                <div className="inline-flex items-center justify-center mb-6">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p
                  className={`text-lg ${
                    propIsDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  🤖 AI is analyzing your performance...
                </p>
                <p
                  className={`text-sm mt-2 ${
                    propIsDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  This may take 10-30 seconds
                </p>
              </div>
            ) : gptRecommendation ? (
              <div className="space-y-8">
                {/* AI Summary */}
                <div
                  className={`${
                    propIsDark ? "bg-gray-800/50" : "bg-white"
                  } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                    propIsDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                      propIsDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    🤖 AI Analysis
                    <span className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                      Powered by OpenAI
                    </span>
                  </h3>
                  <p
                    className={`${
                      propIsDark ? "text-gray-300" : "text-gray-700"
                    } whitespace-pre-line leading-relaxed`}
                  >
                    {gptRecommendation.summary}
                  </p>
                </div>

                {/* Recommended Roles */}
                <div
                  className={`${
                    propIsDark ? "bg-gray-800/50" : "bg-white"
                  } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                    propIsDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-6 ${
                      propIsDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    🎯 AI-Recommended Career Paths
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {gptRecommendation.top_roles.map((role, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-2xl ${
                          propIsDark
                            ? "bg-gradient-to-br from-purple-900/20 to-cyan-900/20"
                            : "bg-gradient-to-br from-purple-50 to-cyan-50"
                        } border ${
                          propIsDark ? "border-purple-700" : "border-purple-300"
                        } transform hover:scale-105 transition-all`}
                      >
                        <div className="text-3xl mb-3">💼</div>
                        <h4
                          className={`font-bold mb-1 ${
                            propIsDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {role}
                        </h4>
                        <p
                          className={`text-xs ${
                            propIsDark ? "text-purple-400" : "text-purple-600"
                          }`}
                        >
                          AI Match #{index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Analysis */}
                {gptRecommendation.skill_analysis && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div
                      className={`${
                        propIsDark ? "bg-gray-800/50" : "bg-white"
                      } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                        propIsDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <h3 className={`text-lg font-bold mb-6 text-green-500`}>
                        💪 Your Strengths
                      </h3>
                      <div className="space-y-4">
                        {gptRecommendation.skill_analysis.strengths.map(
                          (strength, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <span className="text-green-500 mt-1">✅</span>
                              <span
                                className={`text-sm ${
                                  propIsDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {strength}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div
                      className={`${
                        propIsDark ? "bg-gray-800/50" : "bg-white"
                      } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                        propIsDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <h3 className={`text-lg font-bold mb-6 text-yellow-500`}>
                        📈 Growth Areas
                      </h3>
                      <div className="space-y-4">
                        {gptRecommendation.skill_analysis.improvement_areas.map(
                          (area, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <span className="text-yellow-500 mt-1">⚡</span>
                              <span
                                className={`text-sm ${
                                  propIsDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {area}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div
                      className={`${
                        propIsDark ? "bg-gray-800/50" : "bg-white"
                      } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                        propIsDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <h3 className={`text-lg font-bold mb-6 text-blue-500`}>
                        🎓 Learning Priority
                      </h3>
                      <div className="space-y-4">
                        {gptRecommendation.skill_analysis.learning_priority.map(
                          (priority, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                              </span>
                              <span
                                className={`text-sm ${
                                  propIsDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {priority}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`${
                  propIsDark ? "bg-gray-800/50" : "bg-white"
                } backdrop-blur-sm rounded-3xl p-16 shadow-xl border ${
                  propIsDark ? "border-gray-700" : "border-gray-200"
                } text-center`}
              >
                <span className="text-6xl">🤖</span>
                <h3
                  className={`text-xl font-bold mt-4 mb-2 ${
                    propIsDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  AI Insights Unavailable
                </h3>
                <p
                  className={`${
                    propIsDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Unable to generate AI recommendations at this time.
                </p>
              </div>
            )}
          </section>

          {/* Section 6: Learning Roadmap */}
          <section
            ref={(el) => {
              if (el) sectionRefs.current[5] = el;
            }}
            className="min-h-screen py-20"
          >
            <div className="mb-12">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  propIsDark ? "text-white" : "text-gray-900"
                }`}
              >
                Your Learning Roadmap
              </h2>
              <p
                className={`${propIsDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Structured path to achieve your career goals
              </p>
            </div>

            {suggestedLearningPath.length > 0 && (
              <div
                className={`${
                  propIsDark ? "bg-gray-800/50" : "bg-white"
                } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                  propIsDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="relative">
                  {/* Timeline Line */}
                  <div
                    className={`absolute left-8 top-0 bottom-0 w-0.5 ${
                      propIsDark ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>

                  {/* Timeline Items */}
                  <div className="space-y-8">
                    {suggestedLearningPath.map((step, index) => (
                      <div
                        key={index}
                        className="relative flex items-start gap-6"
                      >
                        <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <div
                          className={`flex-1 p-6 rounded-2xl ${
                            propIsDark ? "bg-gray-700/50" : "bg-gray-50"
                          } border ${
                            propIsDark ? "border-gray-600" : "border-gray-200"
                          }`}
                        >
                          <p
                            className={`${
                              propIsDark ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skill Gaps & Focus Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {skillGaps.length > 0 && (
                <div
                  className={`${
                    propIsDark ? "bg-gray-800/50" : "bg-white"
                  } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                    propIsDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-6 ${
                      propIsDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    🔍 Skill Gaps to Address
                  </h3>
                  <div className="space-y-3">
                    {skillGaps.map((gap, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-xl ${
                          propIsDark ? "bg-red-900/20" : "bg-red-50"
                        } border ${
                          propIsDark ? "border-red-800" : "border-red-200"
                        }`}
                      >
                        <span className="text-red-500 mt-1">⚠️</span>
                        <span
                          className={`text-sm ${
                            propIsDark ? "text-red-300" : "text-red-700"
                          }`}
                        >
                          {gap}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {focusAreas.length > 0 && (
                <div
                  className={`${
                    propIsDark ? "bg-gray-800/50" : "bg-white"
                  } backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
                    propIsDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-6 ${
                      propIsDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    🎯 Focus Areas
                  </h3>
                  <div className="space-y-3">
                    {focusAreas.map((area, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-xl ${
                          propIsDark ? "bg-blue-900/20" : "bg-blue-50"
                        } border ${
                          propIsDark ? "border-blue-800" : "border-blue-200"
                        }`}
                      >
                        <span className="text-blue-500 mt-1">🎯</span>
                        <span
                          className={`text-sm ${
                            propIsDark ? "text-blue-300" : "text-blue-700"
                          }`}
                        >
                          {area}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-30">
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className={`px-6 py-3 ${
              propIsDark ? "bg-gray-800" : "bg-white"
            } backdrop-blur-sm rounded-2xl font-medium shadow-xl border ${
              propIsDark
                ? "border-gray-700 hover:bg-gray-700"
                : "border-gray-200 hover:bg-gray-50"
            } transition-all flex items-center gap-2`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                📄 <span className="hidden sm:inline">Download</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowEmailModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-2xl font-medium shadow-xl hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center gap-2"
          >
            📧 <span className="hidden sm:inline">Email</span>
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className={`px-6 py-3 ${
              propIsDark ? "bg-gray-800" : "bg-white"
            } backdrop-blur-sm rounded-2xl font-medium shadow-xl border ${
              propIsDark
                ? "border-gray-700 hover:bg-gray-700"
                : "border-gray-200 hover:bg-gray-50"
            } transition-all flex items-center gap-2`}
          >
            🏠 <span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-md w-full p-8 ${
              propIsDark ? "bg-gray-800" : "bg-white"
            } rounded-3xl shadow-2xl`}
          >
            <h3
              className={`text-2xl font-bold mb-6 ${
                propIsDark ? "text-white" : "text-gray-900"
              }`}
            >
              Email Your Report
            </h3>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 ${
                propIsDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              } border rounded-xl focus:outline-none focus:border-purple-500 transition-all mb-6`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  /* Email logic */
                }}
                disabled={!emailAddress || isExporting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50 transition-all"
              >
                Send Report
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className={`px-6 py-3 ${
                  propIsDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } rounded-xl font-medium transition-all`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default SuccessScreen;
