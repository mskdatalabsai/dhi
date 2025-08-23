"use client";

import React from "react";
import { Target, BookOpen, User } from "lucide-react";

interface WhyChooseProps {
  isDark: boolean;
}

const WhyChoose: React.FC<WhyChooseProps> = ({ isDark }) => {
  return (
    <div className="mb-24">
      <div className="text-center mb-12">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Why Choose Dhiti.ai
        </h2>
        <p
          className={`text-lg max-w-3xl mx-auto ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Our assessments blend psychometric science with machine learning to
          pinpoint the IT career that aligns with your mindset and abilities.
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
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
            <Target className="w-7 h-7 text-purple-600" />
          </div>
          <h3
            className={`text-xl font-bold mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Precision Matching
          </h3>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
            We analyze 50+ behavioral and cognitive data points to match you
            with roles where you’ll excel cutting out months of confusion,
            trial, and error.
          </p>
        </div>

        <div
          className={`rounded-xl p-8 border ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200 shadow-lg"
          }`}
        >
          <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
            <BookOpen className="w-7 h-7 text-teal-600" />
          </div>
          <h3
            className={`text-xl font-bold mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Personalized Learning Path
          </h3>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Get a customized roadmap with specific skills, certifications, and
            projects tailored to your target role.
          </p>
        </div>

        <div
          className={`rounded-xl p-8 border ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200 shadow-lg"
          }`}
        >
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
            <User className="w-7 h-7 text-purple-600" />
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
  );
};

export default WhyChoose;
