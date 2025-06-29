/* eslint-disable @typescript-eslint/no-explicit-any */
// components/QuestionCard.tsx
import React from "react";

interface QuestionCardProps {
  question: {
    id: number;
    type: "multiple_choice" | "single_choice" | "text" | "rating";
    question: string;
    options?: string[];
    scale?: number;
    placeholder?: string;
    required: boolean;
    correctAnswer?: string;
    level?: "easy" | "medium" | "advanced";
  };
  answer: any;
  isDark: boolean;
  hasError: boolean;
  onAnswerChange: (questionId: number, value: any) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  isDark,
  hasError,
  onAnswerChange,
}) => {
  // Handle single choice selection - store INDEX not text
  const handleSingleChoiceChange = (optionIndex: number) => {
    onAnswerChange(question.id, optionIndex);
  };

  // Handle multiple choice selection - store array of INDICES
  const handleMultipleChoiceChange = (optionIndex: number) => {
    const currentAnswers = Array.isArray(answer) ? answer : [];
    let newAnswers;

    if (currentAnswers.includes(optionIndex)) {
      newAnswers = currentAnswers.filter((a) => a !== optionIndex);
    } else {
      newAnswers = [...currentAnswers, optionIndex];
    }

    onAnswerChange(question.id, newAnswers);
  };

  // Handle text input
  const handleTextChange = (value: string) => {
    onAnswerChange(question.id, value);
  };

  // Handle rating selection
  const handleRatingChange = (rating: number) => {
    onAnswerChange(question.id, rating);
  };

  return (
    <div
      className={`mb-6 p-4 sm:p-6 rounded-xl ${
        isDark ? "bg-gray-800" : "bg-white"
      } shadow-lg ${hasError ? "ring-2 ring-red-500" : ""}`}
    >
      {/* Question Text with Difficulty on Left */}
      <div className="flex items-start gap-3 mb-6">
        {/* Difficulty Indicator on Left */}
        {question.level && (
          <div className="flex-shrink-0">
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                question.level === "easy"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : question.level === "medium"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {question.level.charAt(0).toUpperCase() + question.level.slice(1)}
            </span>
          </div>
        )}

        {/* Question Text */}
        <h2
          className={`text-lg sm:text-xl font-semibold flex-1 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {question.question}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h2>
      </div>

      {/* Error Message */}
      {hasError && (
        <p className="text-red-500 text-sm mb-4">
          This question is required. Please provide an answer.
        </p>
      )}

      {/* Single Choice Options */}
      {question.type === "single_choice" && question.options && (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                answer === index
                  ? isDark
                    ? "bg-purple-900 bg-opacity-50 border-purple-500"
                    : "bg-purple-100 border-purple-500"
                  : isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-50 hover:bg-gray-100"
              } border-2 ${
                answer === index
                  ? "border-purple-500"
                  : isDark
                  ? "border-gray-600"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={answer === index}
                onChange={() => handleSingleChoiceChange(index)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span
                className={`ml-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}
              >
                {option}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Multiple Choice Options */}
      {question.type === "multiple_choice" && question.options && (
        <div className="space-y-3">
          <p
            className={`text-sm mb-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Select all that apply
          </p>
          {question.options.map((option, index) => {
            const isChecked = Array.isArray(answer) && answer.includes(index);
            return (
              <label
                key={index}
                className={`flex items-center p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                  isChecked
                    ? isDark
                      ? "bg-purple-900 bg-opacity-50 border-purple-500"
                      : "bg-purple-100 border-purple-500"
                    : isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                } border-2 ${
                  isChecked
                    ? "border-purple-500"
                    : isDark
                    ? "border-gray-600"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleMultipleChoiceChange(index)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span
                  className={`ml-3 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Text Input */}
      {question.type === "text" && (
        <textarea
          value={answer || ""}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={question.placeholder || "Type your answer here..."}
          className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-colors text-sm sm:text-base ${
            isDark
              ? "bg-gray-700 text-white border-gray-600 focus:border-purple-500"
              : "bg-gray-50 text-gray-800 border-gray-200 focus:border-purple-500"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
          rows={4}
        />
      )}

      {/* Rating Scale */}
      {question.type === "rating" && question.scale && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Poor
            </span>
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Excellent
            </span>
          </div>
          <div className="flex justify-between gap-2">
            {Array.from({ length: question.scale }, (_, i) => i + 1).map(
              (rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    answer === rating
                      ? isDark
                        ? "bg-purple-600 text-white"
                        : "bg-purple-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {rating}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
