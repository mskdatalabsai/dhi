// components/SuccessScreen.tsx
import React from "react";

interface SuccessScreenProps {
  isDark: boolean;
  toggleTheme: () => void;
  score?: number;
  totalQuestions?: number;
  percentage?: number;
  timeUsed?: number;
  questionsByLevel?: {
    easy: number;
    medium: number;
    advanced: number;
  };
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  isDark,
  toggleTheme,
  score,
  totalQuestions,
  percentage = 0,
  questionsByLevel,
}) => {
  const isPassed = percentage >= 70;

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-2xl w-full mx-4 p-8 rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isPassed ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <svg
              className={`w-12 h-12 ${
                isPassed ? "text-green-600" : "text-yellow-600"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isPassed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Assessment Completed!
        </h1>

        {/* Score Display */}
        {score !== undefined && totalQuestions !== undefined && (
          <>
            <div className="text-center mb-8">
              <p
                className={`text-5xl font-bold mb-2 ${
                  isPassed
                    ? isDark
                      ? "text-green-400"
                      : "text-green-600"
                    : isDark
                    ? "text-yellow-400"
                    : "text-yellow-600"
                }`}
              >
                {percentage}%
              </p>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                You scored {score} out of {totalQuestions} questions
              </p>
              <p
                className={`text-sm mt-2 ${
                  isPassed
                    ? isDark
                      ? "text-green-400"
                      : "text-green-600"
                    : isDark
                    ? "text-yellow-400"
                    : "text-yellow-600"
                }`}
              >
                {isPassed
                  ? "🎉 Congratulations! You passed!"
                  : "📚 Keep learning and try again!"}
              </p>
            </div>

            {/* Detailed Stats */}
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {questionsByLevel && (
                <>
                  <div className="text-center">
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Easy Questions
                    </p>
                    <p className="text-xl font-semibold text-green-500">
                      {questionsByLevel.easy}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Medium Questions
                    </p>
                    <p className="text-xl font-semibold text-yellow-500">
                      {questionsByLevel.medium}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Advanced Questions
                    </p>
                    <p className="text-xl font-semibold text-red-500">
                      {questionsByLevel.advanced}
                    </p>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Message */}
        <p
          className={`text-center mb-8 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Thank you for completing the assessment. Your results have been saved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Print Results
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isPassed
                ? isDark
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-500 text-white hover:bg-green-600"
                : isDark
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            Back to Home
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
