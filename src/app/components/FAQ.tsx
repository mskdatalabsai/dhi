"use client";

import React from "react";

interface FAQProps {
  isDark: boolean;
}

const FAQ: React.FC<FAQProps> = ({ isDark }) => {
  return (
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
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
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
            Our AI assessment has 95% accuracy based on analysis of over 50,000
            successful career transitions. It uses advanced machine learning
            algorithms trained on industry data and successful placement
            patterns.
          </p>
        </div>

        <div
          className={`p-8 rounded-2xl shadow-lg border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
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
            Our clients save an average of 70% of time typically spent on career
            exploration and role matching. What used to take months now takes
            weeks with our AI-powered insights.
          </p>
        </div>

        <div
          className={`p-8 rounded-2xl shadow-lg border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
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
  );
};

export default FAQ;
