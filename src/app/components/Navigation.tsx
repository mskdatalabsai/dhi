import React from "react";
import { ChevronLeft, ChevronRight, Save, Check } from "lucide-react";

interface Props {
  isDark: boolean;
  currentQuestion: number;
  totalQuestions: number;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
}

const Navigation: React.FC<Props> = ({
  isDark,
  currentQuestion,
  totalQuestions,
  isSubmitting,
  onPrev,
  onNext,
  onSave,
  onSubmit,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={onPrev}
        disabled={currentQuestion === 0}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
          currentQuestion === 0
            ? "opacity-50 cursor-not-allowed"
            : isDark
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex space-x-3">
        <button
          onClick={onSave}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          <Save className="w-3 h-3" />
          Save
        </button>

        {currentQuestion === totalQuestions - 1 ? (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                Submit Survey
                <Check className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all text-sm"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
