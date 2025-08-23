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
          How Dhiti.AI Works
        </h2>
        <p
          className={`text-xl max-w-3xl mx-auto ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Step into clarity with AI-powered insights. Our advanced algorithms
          decode your skills, experience, and ambitions to deliver personalized
          career recommendations guiding you toward the IT role where you’ll
          shine. From who you are → to where you belong.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div
          className={`p-10 rounded-2xl shadow-lg border text-center ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-purple-600">1</span>
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
            Take our comprehensive AI-powered assessment that goes beyond
            resumes — evaluating your technical skills, personality traits, and
            career preferences to reveal the IT role you’re truly built for. Not
            just what you can do, but where you’ll thrive.
          </p>
        </div>

        <div
          className={`p-10 rounded-2xl shadow-lg border text-center ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-teal-600">2</span>
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
            Our machine learning engine compares your profile against thousands
            of proven career journeys and real-world industry demands,
            uncovering the IT roles where your skills and passions align for
            maximum success. Smart insights. Real opportunities. Your perfect
            fit.
          </p>
        </div>

        <div
          className={`p-10 rounded-2xl shadow-lg border text-center ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-purple-600">3</span>
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
            Get a custom career blueprint designed just for you — including role
            recommendations, skill-building roadmaps, and learning paths
            tailored to your unique profile. Your personalized guide from
            today’s potential to tomorrow’s success.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
