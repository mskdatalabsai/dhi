"use client";
import { Eye } from "lucide-react";

const AssessmentPreview = ({ isDark }: { isDark: boolean }) => (
  <div className={`rounded-2xl p-8 border ${isDark ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700" : "bg-gradient-to-br from-white to-gray-50 border-gray-200"} shadow-xl`}>
    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg mb-6 w-fit">
      <Eye className="w-4 h-4" />
      <span>Assessment Preview</span>
    </div>

    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          AI Career Assessment
        </h3>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">In Progress</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div className="bg-gradient-to-r from-purple-600 to-teal-600 h-2 rounded-full" style={{ width: "65%" }} />
      </div>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Step 3 of 5: Technical Skills Assessment</p>
    </div>

    <div className={`p-6 rounded-xl mb-4 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
      <p className={`font-medium mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
        Which machine learning framework are you most proficient in?
      </p>
      <div className="space-y-3">
        {["TensorFlow", "PyTorch", "Scikit-learn", "Keras"].map((option, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              i === 1
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : isDark
                ? "border-gray-600 hover:border-gray-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  i === 1
                    ? "border-purple-500 bg-purple-500"
                    : isDark
                    ? "border-gray-500"
                    : "border-gray-300"
                }`}
              >
                {i === 1 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <span
                className={`text-sm ${
                  i === 1
                    ? "text-purple-700 dark:text-purple-400 font-medium"
                    : isDark
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                {option}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className={`text-center p-4 rounded-xl ${isDark ? "bg-gray-700/50" : "bg-purple-50"}`}>
      <p className={`text-sm font-medium ${isDark ? "text-purple-400" : "text-purple-700"}`}>
        AI Prediction: 92% match for ML Engineer roles
      </p>
    </div>

    <div className="text-center mt-4">
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        ↑ This is how our assessment interface looks
      </p>
    </div>
  </div>
);

export default AssessmentPreview;
