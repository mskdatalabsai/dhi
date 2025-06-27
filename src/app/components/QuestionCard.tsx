import React from "react";
import { AlertCircle } from "lucide-react";

type Question = {
  id: number;
  type: "multiple_choice" | "single_choice" | "text" | "rating";
  question: string;
  options?: string[];
  scale?: number;
  placeholder?: string;
  required: boolean;
};

interface Props {
  question: Question;
  answer: unknown;
  isDark: boolean;
  hasError: boolean;
  onAnswerChange: (
    questionId: number,
    value: string | number | string[]
  ) => void;
}

const QuestionCard: React.FC<Props> = ({
  question,
  answer,
  isDark,
  hasError,
  onAnswerChange,
}) => {
  const renderInput = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {question.options?.map((option, idx) => {
              const selected = Array.isArray(answer) && answer.includes(option);
              return (
                <label
                  key={idx}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    selected
                      ? isDark
                        ? "bg-purple-900/20 border-purple-600"
                        : "bg-purple-50 border-purple-600"
                      : isDark
                      ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                      : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                      const current = Array.isArray(answer) ? [...answer] : [];
                      const newValue = e.target.checked
                        ? [...current, option]
                        : current.filter((item) => item !== option);
                      onAnswerChange(question.id, newValue);
                    }}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span
                    className={`ml-3 text-sm ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case "single_choice":
        return (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {question.options?.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  answer === option
                    ? isDark
                      ? "bg-emerald-900/20 border-emerald-600"
                      : "bg-emerald-50 border-emerald-600"
                    : isDark
                    ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                    : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  checked={answer === option}
                  onChange={() => onAnswerChange(question.id, option)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span
                  className={`ml-3 text-sm ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case "text":
        return (
          <textarea
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className={`w-full p-3 rounded-lg border-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm ${
              hasError
                ? "border-red-500"
                : isDark
                ? "border-gray-600"
                : "border-gray-300"
            } ${
              isDark
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-white text-gray-900 placeholder-gray-500"
            }`}
          />
        );

      case "rating":
        return (
          <div className="flex space-x-2">
            {Array.from({ length: question.scale || 5 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onAnswerChange(question.id, idx + 1)}
                className={`w-10 h-10 rounded-full border-2 font-semibold transition-all text-sm ${
                  answer === idx + 1
                    ? "bg-gradient-to-r from-purple-600 to-teal-600 text-white border-purple-600"
                    : isDark
                    ? "border-gray-600 text-gray-300 hover:border-purple-500"
                    : "border-gray-300 text-gray-700 hover:border-purple-500"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex-1 rounded-xl p-6 shadow-xl border transition-colors duration-300 flex flex-col ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="mb-4">
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {question.question}
        </h2>
        <div className="flex items-center space-x-2 mt-1">
          {question.required && (
            <span className="text-red-500 text-xs">* Required</span>
          )}
          {hasError && (
            <div className="flex items-center space-x-1 text-red-500">
              <AlertCircle className="w-3 h-3" />
              <span className="text-xs">This question is required</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{renderInput()}</div>
    </div>
  );
};

export default QuestionCard;
