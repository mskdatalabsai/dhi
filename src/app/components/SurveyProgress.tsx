import React from "react";

interface SurveyProgressProps {
  isDark: boolean;
  currentQuestion: number;
  totalQuestions: number;
  totalTimeLeft: number;
  getProgressBarColor: () => string;
}

const SurveyProgress: React.FC<SurveyProgressProps> = ({
  isDark,
  currentQuestion,
  totalQuestions,
  totalTimeLeft,
  getProgressBarColor,
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span
          className={`text-xs font-medium ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span
          className={`text-xs font-medium ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {Math.round(progress)}% Complete
        </span>
      </div>

      <div
        className={`w-full h-2 rounded-full ${
          isDark ? "bg-gray-700" : "bg-gray-200"
        } mb-1`}
      >
        <div
          className="h-2 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={`w-full h-1.5 rounded-full ${
          isDark ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <div
          className={`h-1.5 rounded-full transition-all duration-1000 ${getProgressBarColor()}`}
          style={{ width: `${(totalTimeLeft / 3600) * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
        <span>Survey Progress</span>
        <span>Time Progress</span>
      </div>
    </div>
  );
};

export default SurveyProgress;
