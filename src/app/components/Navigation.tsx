// components/Navigation.tsx
import React from "react";

interface NavigationProps {
  isDark: boolean;
  currentQuestion: number;
  totalQuestions: number;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isDark,
  currentQuestion,
  totalQuestions,
  isSubmitting,
  onPrev,
  onNext,
  onSave,
  onSubmit,
}) => {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      <button
        onClick={onPrev}
        disabled={isFirstQuestion}
        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all ${
          isFirstQuestion
            ? isDark
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            : isDark
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        ← Previous
      </button>

      <div className="flex gap-4 w-full sm:w-auto">
        <button
          onClick={onSave}
          className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg font-medium transition-all ${
            isDark
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Save Progress
        </button>

        {isLastQuestion ? (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg font-medium transition-all ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex-1 sm:flex-initial px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
