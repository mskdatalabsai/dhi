"use client";

import React from "react";

interface HowItWorksProps {
  isDark: boolean;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ isDark }) => {
  return (
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
          Advanced algorithms analyze your skills, experience, and career goals
          to provide personalized recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div
          className={`p-10 rounded-2xl shadow-lg border text-center ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
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
            Take our comprehensive AI-powered assessment that evaluates your
            technical skills, personality traits, and career preferences
          </p>
        </div>

        <div
          className={`p-10 rounded-2xl shadow-lg border text-center ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
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
            Our machine learning algorithms process your data against thousands
            of successful career paths and industry requirements
          </p>
        </div>

        <div
          className={`p-10 rounded-2xl shadow-lg border text-center ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
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
            Receive a customized learning path, role recommendations, and career
            roadmap tailored specifically to your profile
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
