import React, { useState } from "react";

interface InstructionsPopupProps {
  isDark: boolean;
  onAccept: () => void;
}

const InstructionsPopup: React.FC<InstructionsPopupProps> = ({
  isDark,
  onAccept,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleProceed = () => {
    if (isChecked) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${isDark ? "bg-black/70" : "bg-black/50"}`}
      />

      {/* Modal */}
      <div
        className={`relative max-w-2xl w-full mx-4 p-8 rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <h2
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Survey Instructions
          </h2>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Please read the following instructions carefully before proceeding
          </p>
        </div>

        {/* Instructions Content */}
        <div
          className={`mb-8 p-6 rounded-lg ${
            isDark ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <ul
            className={`space-y-3 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            <li className="flex items-start">
              <span className="text-purple-500 mr-3 mt-1">•</span>
              <span>
                This survey consists of 60 questions designed to assess your
                Data Science knowledge and interests.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-3 mt-1">•</span>
              <span>
                You have <strong>60 minutes</strong> to complete all questions.
                The timer will start once you click &quot;Proceed&quot;.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-3 mt-1">•</span>
              <span>
                Some questions are marked as required and must be answered
                before proceeding.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-3 mt-1">•</span>
              <span>
                You can navigate between questions using the Previous and Next
                buttons.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-3 mt-1">•</span>
              <span>
                Your progress is automatically saved as you move between
                questions.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-3 mt-1">•</span>
              <span>
                Once the timer expires, your survey will be automatically
                submitted.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-3 mt-1">•</span>
              <span>
                Please ensure you have a stable internet connection throughout
                the survey.
              </span>
            </li>
          </ul>
        </div>

        {/* Checkbox */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-5 h-5 text-purple-600 border-2 rounded focus:ring-purple-500 focus:ring-2 mr-3"
            />
            <span
              className={`select-none ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              I have read and understood the instructions above
            </span>
          </label>
        </div>

        {/* Button */}
        <button
          onClick={handleProceed}
          disabled={!isChecked}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isChecked
              ? "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transform hover:scale-[1.02]"
              : isDark
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isChecked
            ? "Proceed to Survey"
            : "Please accept the instructions to proceed"}
        </button>
      </div>
    </div>
  );
};

export default InstructionsPopup;
