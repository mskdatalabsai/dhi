"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface CTAFormProps {
  isDark: boolean;
  formData: {
    name: string;
    email: string;
    company: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CTAForm: React.FC<CTAFormProps> = ({
  isDark,
  formData,
  handleInputChange,
}) => {
  return (
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
            Invest in yourself today. Your IT future starts here
          </h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
                className={`w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
              className={`w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => (window.location.href = "/payment")}
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-purple-600 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                Start Assessment
                <ArrowRight className="ml-3 w-5 h-5" />
              </button>
            </div>
          </div>
          <p
            className={`text-center mt-6 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            • Free career counseling • Industry expert guidance
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTAForm;
