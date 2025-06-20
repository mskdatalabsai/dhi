"use client";

import React from "react";
import { ArrowRight, Play } from "lucide-react";

interface landHeroProps {
  isDark: boolean;
}

const LandHero = ({ isDark }: landHeroProps) => {
  return (
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
              Our AI-driven assessment analyzes your skills, experience, and
              goals to match you with the ideal data science role. Join 5,000+
              professionals who&apos;ve transformed their careers.
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
                <span className="font-semibold">5,000+</span> professionals
                placed
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
                Which machine learning framework are you most proficient in?
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
  );
};

export default LandHero;
