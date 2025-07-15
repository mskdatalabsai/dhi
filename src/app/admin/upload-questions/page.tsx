/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/admin/upload-questions.tsx (or app/admin/upload-questions/page.tsx)
"use client";

import React, { useState } from "react";
import { QuestionUploader } from "../../utils/admin/uploadQuestions";
import { QuizQuestion } from "../../types/quiz";

interface UploadCase {
  caseName: string;
  caseNumber: number;
  file: File | null;
  description: string;
  questions: QuizQuestion[];
}

const AdminUploadQuestions: React.FC = () => {
  const [cases, setCases] = useState<UploadCase[]>([
    {
      caseName: "Case 1",
      caseNumber: 1,
      file: null,
      description: "",
      questions: [],
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const addNewCase = () => {
    const nextCaseNumber = cases.length + 1;
    setCases((prev) => [
      ...prev,
      {
        caseName: `Case ${nextCaseNumber}`,
        caseNumber: nextCaseNumber,
        file: null,
        description: "",
        questions: [],
      },
    ]);
  };

  const removeCase = (index: number) => {
    setCases((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Renumber cases
      return updated.map((case_, i) => ({
        ...case_,
        caseName: `Case ${i + 1}`,
        caseNumber: i + 1,
      }));
    });
  };

  const updateCase = (index: number, field: keyof UploadCase, value: any) => {
    setCases((prev) =>
      prev.map((case_, i) =>
        i === index ? { ...case_, [field]: value } : case_
      )
    );
  };

  const handleFileUpload = async (index: number, file: File) => {
    try {
      const text = await file.text();
      const questions: QuizQuestion[] = JSON.parse(text);

      // Validate JSON structure
      if (!Array.isArray(questions) || questions.length === 0) {
        alert("Invalid JSON format. Expected an array of questions.");
        return;
      }

      // Basic validation of question structure
      const isValidStructure = questions.every(
        (q) =>
          q.question &&
          q.options &&
          q.options.a &&
          q.options.b &&
          q.options.c &&
          q.options.d &&
          q.correctOption &&
          q.level
      );

      if (!isValidStructure) {
        alert("Invalid question structure. Please check your JSON format.");
        return;
      }

      updateCase(index, "file", file);
      updateCase(index, "questions", questions);
      setUploadStatus(
        `✅ Loaded ${questions.length} questions for ${file.name}`
      );
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert("Error parsing JSON file. Please check the format.");
    }
  };

  const uploadAllCases = async () => {
    setIsUploading(true);
    setUploadStatus("");

    try {
      // Validate all cases
      const validCases = cases.filter(
        (case_) => case_.caseName && case_.questions.length > 0
      );

      if (validCases.length === 0) {
        alert("Please add at least one case with questions.");
        return;
      }

      setUploadStatus("🚀 Starting upload process...");

      const uploadData = validCases.map((case_) => ({
        caseName: case_.caseName,
        caseNumber: case_.caseNumber,
        description: case_.description || `Questions for ${case_.caseName}`,
        jsonData: case_.questions,
      }));

      await QuestionUploader.uploadCasesWithQuestions(uploadData);

      setUploadStatus("🎉 All cases uploaded successfully!");

      // Clear form after successful upload
      setCases([
        {
          caseName: "Case 1",
          caseNumber: 1,
          file: null,
          description: "",
          questions: [],
        },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(
        `❌ Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const quickSetupTenCases = () => {
    const tenCases: UploadCase[] = Array.from({ length: 10 }, (_, i) => ({
      caseName: `Case ${i + 1}`,
      caseNumber: i + 1,
      file: null,
      description: `Questions for Case ${i + 1}`,
      questions: [],
    }));
    setCases(tenCases);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Upload Question Cases to Firestore
          </h1>
          <p className="text-gray-600 mt-1">
            Upload your 10 JSON files to create case-based assessments
          </p>
          <a
            href="/"
            className="mt-2 text-sm text-purple-600 hover:text-purple-800"
          >
            ← Back to Home
          </a>
        </div>

        {uploadStatus && (
          <div
            className={`p-4 mb-6 rounded-md ${
              uploadStatus.includes("❌")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {uploadStatus}
          </div>
        )}

        {/* Quick Setup */}
        <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Quick Setup</h3>
          <p className="text-sm text-blue-700 mb-3">
            Set up all 10 cases at once to match your JSON files (case1.json,
            case2.json, etc.)
          </p>
          <button
            onClick={quickSetupTenCases}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Setup 10 Cases
          </button>
        </div>

        <div className="space-y-6">
          {cases.map((case_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {case_.caseName}
                </h3>
                {cases.length > 1 && (
                  <button
                    onClick={() => removeCase(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Case Name
                  </label>
                  <input
                    type="text"
                    value={case_.caseName}
                    onChange={(e) =>
                      updateCase(index, "caseName", e.target.value)
                    }
                    placeholder="e.g., Case 1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Case Number
                  </label>
                  <input
                    type="number"
                    value={case_.caseNumber}
                    onChange={(e) =>
                      updateCase(index, "caseNumber", parseInt(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={case_.description}
                  onChange={(e) =>
                    updateCase(index, "description", e.target.value)
                  }
                  placeholder="Brief description of this case"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Upload JSON File * (Expected: case{case_.caseNumber}.json)
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(index, file);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {case_.questions.length > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    ✅ {case_.questions.length} questions loaded
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={addNewCase}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Another Case
          </button>

          <button
            onClick={uploadAllCases}
            disabled={
              isUploading ||
              cases.every((c) => !c.caseName || c.questions.length === 0)
            }
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload All Cases to Firestore"}
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h4 className="font-semibold mb-2">JSON Format Requirements:</h4>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {`[
  {
    "functionalArea": "string",
    "roleTitle": "string", 
    "questionId": "string",
    "question": "string",
    "options": {
      "a": "string",
      "b": "string", 
      "c": "string",
      "d": "string"
    },
    "correctOption": "a|b|c|d",
    "level": "easy|medium|advanced"
  }
]`}
          </pre>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Expected files:</strong> case1.json, case2.json,
              case3.json, ..., case10.json
            </p>
            <p>
              <strong>Assessment:</strong> 60 random questions per test from
              thousands available
            </p>
            <p>
              <strong>Distribution:</strong> 20 easy, 25 medium, 15 advanced
              (when balanced mode is used)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUploadQuestions;
