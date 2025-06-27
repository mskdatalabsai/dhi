import React from "react";
import { Clock } from "lucide-react";

interface SurveyHeaderProps {
  isDark: boolean;
  totalTimeLeft: number;
  formatTime: (seconds: number) => string;
  getTimerColor: () => string;
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({
  isDark,
  totalTimeLeft,
  formatTime,
  getTimerColor,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Data Science Assessment Survey
        </h1>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Help us understand your learning goals and background
        </p>
      </div>

      <div
        className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
          isDark
            ? totalTimeLeft <= 600
              ? "bg-red-900/30 animate-pulse"
              : "bg-gray-800"
            : totalTimeLeft <= 600
            ? "bg-red-100 animate-pulse"
            : "bg-gray-100"
        }`}
      >
        <Clock className={`w-4 h-4 ${getTimerColor()}`} />
        <span className={`font-semibold text-sm ${getTimerColor()}`}>
          {formatTime(totalTimeLeft)}
        </span>
      </div>
    </div>
  );
};

export default SurveyHeader;
