"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Play, Target, BookOpen, User } from "lucide-react";
import Navbar from "./components/navbar";

const HomePage = () => {
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Check system preference
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
            : "bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50"
        }`}
      >
        {/* Main Content */}
        <div className="container mx-auto px-6 pt-24 pb-16 max-w-7xl">
          {/* Hero Section */}
          <div className="mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
                    AI-Powered Career Assessment Platform
                  </span>
                  <h1
                    className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Find Your Perfect
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                      {" "}
                      Data Science{" "}
                    </span>
                    Career Path
                  </h1>
                  <p
                    className={`text-xl leading-relaxed mb-8 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Our AI-driven assessment analyzes your skills, experience,
                    and goals to match you with the ideal data science role.
                    Join 5,000+ professionals who&apos;ve transformed their
                    careers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={() => (window.location.href = "/payment")}
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Start Free Assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById("how-it-works");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-transparent text-white border-gray-600 hover:bg-gray-800"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    Watch Demo
                    <Play className="ml-2 w-5 h-5" />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-full border-2 ${
                            isDark ? "border-gray-800" : "border-white"
                          } overflow-hidden ${
                            isDark ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-500" />
                        </div>
                      ))}
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <span className="font-semibold">5,000+</span>{" "}
                      professionals placed
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span
                      className={`text-sm ml-2 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      4.9/5 rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content - Visual Element */}
              <div className="relative">
                {/* Preview Label */}
                <div className="absolute -top-3 left-6 z-10">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>Live Assessment Preview</span>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-8 shadow-2xl border ${
                    isDark
                      ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                      : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
                  }`}
                >
                  {/* Mock Assessment Interface */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`text-lg font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        AI Career Assessment
                      </h3>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        In Progress
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-green-600 h-2 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Step 3 of 5: Technical Skills Assessment
                    </p>
                  </div>

                  {/* Mock Question */}
                  <div
                    className={`p-6 rounded-xl mb-4 ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`font-medium mb-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Which machine learning framework are you most proficient
                      in?
                    </p>
                    <div className="space-y-3">
                      {["TensorFlow", "PyTorch", "Scikit-learn", "Keras"].map(
                        (option, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              i === 1
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                : isDark
                                ? "border-gray-600 hover:border-gray-500"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                  i === 1
                                    ? "border-emerald-500 bg-emerald-500"
                                    : isDark
                                    ? "border-gray-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {i === 1 && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-sm ${
                                  i === 1
                                    ? "text-emerald-700 dark:text-emerald-400 font-medium"
                                    : isDark
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }`}
                              >
                                {option}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Mock Results Preview */}
                  <div
                    className={`text-center p-4 rounded-xl ${
                      isDark ? "bg-gray-700/50" : "bg-emerald-50"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-emerald-400" : "text-emerald-700"
                      }`}
                    >
                      AI Prediction: 92% match for ML Engineer roles
                    </p>
                  </div>
                </div>

                {/* Bottom Caption */}
                <div className="text-center mt-4">
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    ↑ Experience our intuitive assessment interface
                  </p>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            className={`mb-24 rounded-2xl p-8 ${
              isDark ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  95%
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Assessment Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  5,000+
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Professionals Placed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  15min
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Average Test Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  $85K
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Average Salary
                </div>
              </div>
            </div>
          </div>

          {/* Main Features Grid */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Why Choose Our AI Assessment Platform
              </h2>
              <p
                className={`text-lg max-w-3xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Science-backed assessments combined with machine learning to
                predict your ideal career path
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div
                className={`rounded-xl p-8 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200 shadow-lg"
                }`}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-emerald-600" />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Precision Matching
                </h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Our AI analyzes 50+ data points to match you with roles where
                  you&apos;ll excel, saving months of trial and error.
                </p>
              </div>

              <div
                className={`rounded-xl p-8 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200 shadow-lg"
                }`}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-emerald-600" />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Personalized Learning Path
                </h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Get a customized roadmap with specific skills, certifications,
                  and projects tailored to your target role.
                </p>
              </div>

              <div
                className={`rounded-xl p-8 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200 shadow-lg"
                }`}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <User className="w-7 h-7 text-emerald-600" />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Expert Guidance
                </h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Connect with industry mentors and get placement support from
                  professionals at top tech companies.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <section className="mb-24" id="how-it-works">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                How Our AI Assessment Works
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Advanced algorithms analyze your skills, experience, and career
                goals to provide personalized recommendations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div
                className={`p-10 rounded-2xl shadow-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-emerald-600">1</span>
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Assessment Test
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Take our comprehensive AI-powered assessment that evaluates
                  your technical skills, personality traits, and career
                  preferences
                </p>
              </div>

              <div
                className={`p-10 rounded-2xl shadow-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-emerald-600">2</span>
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  AI Analysis
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Our machine learning algorithms process your data against
                  thousands of successful career paths and industry requirements
                </p>
              </div>

              <div
                className={`p-10 rounded-2xl shadow-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-emerald-600">3</span>
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Personalized Plan
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Receive a customized learning path, role recommendations, and
                  career roadmap tailored specifically to your profile
                </p>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Success Stories
              </h2>
              <p
                className={`text-xl ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                See how our AI assessment transformed careers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p
                  className={`mb-6 italic leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  &quot;The AI assessment identified my perfect role match. I
                  got placed as a Data Scientist at Google within 3
                  months!&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">AS</span>
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Anish Sharma
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Data Scientist at Google
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p
                  className={`mb-6 italic leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  &quot;Amazing accuracy! The assessment predicted my success in
                  ML Engineering. Now earning 80% more than before.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">PS</span>
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Priya Singh
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      ML Engineer at Microsoft
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p
                  className={`mb-6 italic leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  &quot;Saved months of career confusion. The AI showed me
                  exactly which skills to develop for my dream role.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">RK</span>
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Rahul Kumar
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Senior Analyst at Amazon
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="mb-24">
            <div
              className={`rounded-2xl p-12 ${
                isDark ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-center text-sm font-medium mb-8 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                TRUSTED BY PROFESSIONALS FROM
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-70">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Google
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Microsoft
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Amazon
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Meta
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Apple
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  How accurate is the AI assessment?
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Our AI assessment has 95% accuracy based on analysis of over
                  50,000 successful career transitions. It uses advanced machine
                  learning algorithms trained on industry data and successful
                  placement patterns.
                </p>
              </div>

              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  How much time does the assessment save?
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Our clients save an average of 70% of time typically spent on
                  career exploration and role matching. What used to take months
                  now takes weeks with our AI-powered insights.
                </p>
              </div>

              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  What makes this different from other assessments?
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Unlike traditional assessments, our AI analyzes your complete
                  profile against real industry data, current market trends, and
                  successful career patterns to provide actionable, personalized
                  recommendations.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Form Section */}
          <section className="mt-24" id="cta-form">
            <div className="max-w-3xl mx-auto">
              <div
                className={`rounded-3xl p-12 shadow-2xl border ${
                  isDark
                    ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                    : "bg-gradient-to-br from-white to-gray-50 border-gray-100"
                }`}
              >
                <h2
                  className={`text-3xl md:text-4xl font-bold text-center mb-8 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Start Your Data Science Journey
                </h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => (window.location.href = "/payment")}
                      className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
                    >
                      Start Free Consultation
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p
                  className={`text-center mt-6 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No upfront payment • Free career counseling • Industry expert
                  guidance
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HomePage;
