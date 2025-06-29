// components/InstructionsPopup.tsx
import React from "react";

interface InstructionsPopupProps {
  isDark: boolean;
  onAccept: () => void;
}

const InstructionsPopup: React.FC<InstructionsPopupProps> = ({
  isDark,
  onAccept,
}) => {
  const instructions = [
    "You have 60 minutes to complete the assessment",
    "Each question is multiple choice with only one correct answer",
    "All questions are mandatory - you cannot skip any question",
    "Your progress is automatically saved",
    "Once you submit, you cannot change your answers",
  ];

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <div
        className={`w-full max-w-2xl mx-auto ${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl`}
      >
        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Removed max-height and overflow restrictions */}
          {/* Welcome Message */}

          {/* Instructions */}
          <h2
            className={`text-lg sm:text-xl font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Instructions:
          </h2>

          <ul className="space-y-3 mb-6">
            {instructions.map((instruction, index) => (
              <li
                key={index}
                className={`flex items-start ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 ${
                    isDark
                      ? "bg-purple-900 text-purple-300"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-sm sm:text-base">{instruction}</span>
              </li>
            ))}
          </ul>

          {/* Important Notes */}
          <div
            className={`p-4 rounded-lg border-2 ${
              isDark
                ? "bg-yellow-900 bg-opacity-20 border-yellow-700 text-yellow-300"
                : "bg-yellow-50 border-yellow-300 text-yellow-800"
            }`}
          >
            <h3 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Important
            </h3>
            <ul className="text-xs sm:text-sm space-y-1">
              <li>
                • The timer starts immediately after you accept these
                instructions
              </li>
              <li>
                • Make sure you&apos;re in a quiet environment without
                distractions
              </li>
              <li>
                • Use a stable internet connection to avoid losing progress
              </li>
            </ul>
          </div>
        </div>

        {/* Footer with Accept Button */}
        <div
          className={`p-6 sm:p-8 border-t ${
            isDark
              ? "bg-gray-900 border-gray-700"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="agree"
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              required
            />
            <label
              htmlFor="agree"
              className={`ml-2 text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              I have read and understood all the instructions
            </label>
          </div>

          <button
            onClick={onAccept}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
              isDark
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-600 hover:bg-purple-700"
            } focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50`}
          >
            Start Assessment
          </button>

          <p
            className={`text-xs text-center mt-3 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            By clicking Start Assessment, you agree to begin the timed test
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPopup;
