"use client";

import React from "react";

interface TrustedByProps {
  isDark: boolean;
}

const TrustedBy: React.FC<TrustedByProps> = ({ isDark }) => {
  return (
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
  );
};

export default TrustedBy;
