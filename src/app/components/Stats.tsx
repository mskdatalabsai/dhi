"use client";

import React from "react";

interface StatsProps {
  isDark: boolean;
}

const Stats: React.FC<StatsProps> = ({ isDark }) => {
  return (
    <div
      className={`mb-24 rounded-2xl p-8 ${
        isDark ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
            95%
          </div>
          <div
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Assessment Accuracy
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
            5,000+
          </div>
          <div
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Professionals Placed
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
            15min
          </div>
          <div
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Average Test Time
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
            $85K
          </div>
          <div
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Average Salary
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
