import React from "react";
import { Check, Loader2 } from "lucide-react";

const SubmitSection = ({
  isDark,
  isSaving,
  handleSubmit,
}: {
  isDark: boolean;
  isSaving: boolean;
  handleSubmit: () => void;
}) => (
  <div
    className={`rounded-xl p-8 text-center ${
      isDark ? "bg-gray-800" : "bg-gray-100"
    }`}
  >
    <button
      onClick={handleSubmit}
      disabled={isSaving}
      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isSaving ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Check className="w-5 h-5 mr-2" />
          Save Profile & Start Assessment
        </>
      )}
    </button>
    <p className={`text-sm mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
      Your profile will be saved and you&apos;ll be redirected to the assessment
    </p>
  </div>
);

export default SubmitSection;
