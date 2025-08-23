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
            Our AI assessment is designed with psychometric science + machine
            learning. It analyzes 50+ behavioral, cognitive, and technical data
            points and benchmarks them against thousands of real-world IT career
            paths. While no assessment can guarantee 100% accuracy, Dhiti
            consistently delivers highly reliable recommendations that align
            with your strengths, interests, and market demand.
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
            Who can take this assessment?
          </h3>
          <p
            className={`leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Anyone exploring or advancing an IT career: • Students & Freshers
            figuring out where to start • Career switchers moving into tech from
            other fields
            <ul>
              <li>
                <strong>Students & Freshers</strong> figuring out where to start
              </li>
              <li>
                <strong>Career switchers</strong> moving into tech from other
                fields
              </li>
              <li>
                <strong>IT professionals</strong> seeking growth or a domain
                switch
              </li>
            </ul>
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
            Do I need prior IT knowledge to take it?
          </h3>
          <p
            className={`leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            No. Dhiti is built to work for all backgrounds, from absolute
            beginners to seasoned professionals.
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
            Is my data safe?
          </h3>
          <p
            className={`leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Absolutely. We follow strict data privacy standards. Your responses
            are encrypted and used only to generate your career insights.
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
            What happens after I complete the assessment?
          </h3>
          <p
            className={`leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            You’ll receive a personalized career report that includes:{" "}
            <ul>
              <li>
                <b>Recommended</b> IT roles that fit you best{" "}
              </li>
              <li>
                <b>A step-by-step</b> learning roadmap (skills, certifications,
                projects)
              </li>
              <li>
                <b>Access</b> to mentorship and placement guidance
              </li>
            </ul>
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
            Unlike traditional tests that stop at generic personality scores,
            Dhiti.AI goes deeper. Our AI analyzes your entire profile — skills,
            traits, passions, and ambitions — and matches it against real
            industry data, evolving market trends, and proven career journeys.
            The result? Actionable, personalized recommendations that help you
            choose not just a career, but the right IT role where you’ll thrive
            and stay future-ready. Not just an assessment. A career compass.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
