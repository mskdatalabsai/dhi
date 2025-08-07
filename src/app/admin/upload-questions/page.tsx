/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QuizQuestion } from "../../types/quiz";
import {
  roleToCollection,
  qualitativeClusters,
} from "../../lib/config/roleMapping";

interface UploadBatch {
  id: string;
  type: "technical" | "qualitative";
  targetCollection: string;
  displayName: string;
  file: File | null;
  questions: QuizQuestion[];
  description: string;
}

const AdminUploadQuestions: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [batches, setBatches] = useState<UploadBatch[]>([
    {
      id: "batch-1",
      type: "technical",
      targetCollection: "",
      displayName: "",
      file: null,
      questions: [],
      description: "",
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === "loading") return;

      if (status === "unauthenticated") {
        router.push("/auth/signin");
        return;
      }

      try {
        const response = await fetch("/api/admin/upload-questions");
        const data = await response.json();

        if (!data.isAdmin) {
          alert("You don't have permission to access this page.");
          router.push("/");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [status, router]);

  const addNewBatch = () => {
    const newBatch: UploadBatch = {
      id: `batch-${Date.now()}`,
      type: "technical",
      targetCollection: "",
      displayName: "",
      file: null,
      questions: [],
      description: "",
    };
    setBatches((prev) => [...prev, newBatch]);
  };

  const removeBatch = (id: string) => {
    setBatches((prev) => prev.filter((batch) => batch.id !== id));
  };

  const updateBatch = (id: string, updates: Partial<UploadBatch>) => {
    setBatches((prev) =>
      prev.map((batch) => (batch.id === id ? { ...batch, ...updates } : batch))
    );
  };

  const handleFileUpload = async (batchId: string, file: File) => {
    try {
      const text = await file.text();
      const questions: QuizQuestion[] = JSON.parse(text);

      // Validate JSON structure
      if (!Array.isArray(questions) || questions.length === 0) {
        alert("Invalid JSON format. Expected an array of questions.");
        return;
      }

      // Basic validation of question structure
      const batch = batches.find((b) => b.id === batchId);
      const isBehavioral = batch?.type === "qualitative";

      const isValidStructure = questions.every((q) => {
        // Common validations
        if (!q.question || !q.options || !q.correctOption) return false;

        if (isBehavioral) {
          // Behavioral questions should have 5 options (a-e)
          return (
            q.options.a &&
            q.options.b &&
            q.options.c &&
            q.options.d &&
            q.options.e
          );
        } else {
          // Technical questions should have 4 options (a-d) and level
          return (
            q.options.a && q.options.b && q.options.c && q.options.d && q.level
          );
        }
      });

      if (!isValidStructure) {
        alert(
          `Invalid question structure. ${
            isBehavioral
              ? "Behavioral questions need 5 options (a-e)"
              : "Technical questions need 4 options (a-d) and level"
          }`
        );
        return;
      }

      updateBatch(batchId, { file, questions });
      setUploadStatus(
        `✅ Loaded ${questions.length} questions from ${file.name}`
      );
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert("Error parsing JSON file. Please check the format.");
    }
  };

  const uploadBatch = async (
    batch: UploadBatch
  ): Promise<{ success: boolean; count?: number; error?: string }> => {
    if (!batch.targetCollection || batch.questions.length === 0) {
      return { success: false, error: "Missing collection or questions" };
    }

    try {
      setUploadProgress((prev) => ({ ...prev, [batch.id]: 0 }));

      const response = await fetch("/api/admin/upload-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: batch.type,
          targetCollection: batch.targetCollection,
          questions: batch.questions,
          batchId: batch.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadProgress((prev) => ({ ...prev, [batch.id]: 100 }));

      return { success: true, count: data.count };
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const uploadAllBatches = async () => {
    setIsUploading(true);
    setUploadStatus("");
    setUploadProgress({});

    try {
      const validBatches = batches.filter(
        (batch) => batch.targetCollection && batch.questions.length > 0
      );

      if (validBatches.length === 0) {
        alert("Please add at least one batch with questions.");
        return;
      }

      setUploadStatus("🚀 Starting upload process...");

      let totalUploaded = 0;
      const results = [];

      for (const batch of validBatches) {
        setUploadStatus(
          `📤 Uploading ${batch.displayName || batch.targetCollection}...`
        );
        const result = await uploadBatch(batch);

        if (result.success && result.count) {
          totalUploaded += result.count;
          results.push(`✅ ${batch.displayName}: ${result.count} questions`);
        } else {
          results.push(`❌ ${batch.displayName}: ${result.error}`);
        }
      }

      setUploadStatus(
        `🎉 Upload complete!\n${results.join(
          "\n"
        )}\nTotal: ${totalUploaded} questions uploaded`
      );

      // Clear successful batches
      setBatches([
        {
          id: "batch-1",
          type: "technical",
          targetCollection: "",
          displayName: "",
          file: null,
          questions: [],
          description: "",
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

  const quickSetupCommonRoles = () => {
    const commonRoles = [
      "Software Engineer / Developer",
      "Data Scientist",
      "DevOps Engineer",
      "Product Manager",
      "UX Designer (User Experience)",
    ];

    const newBatches: UploadBatch[] = commonRoles.map((role, index) => ({
      id: `batch-${Date.now()}-${index}`,
      type: "technical" as const,
      targetCollection: roleToCollection[role],
      displayName: role,
      file: null,
      questions: [],
      description: `Technical questions for ${role}`,
    }));

    // Add qualitative batches
    Object.entries(qualitativeClusters).forEach(([key, cluster], index) => {
      newBatches.push({
        id: `batch-qual-${Date.now()}-${index}`,
        type: "qualitative" as const,
        targetCollection: cluster,
        displayName: cluster.replace(/_/g, " "),
        file: null,
        questions: [],
        description: `Behavioral questions for ${cluster}`,
      });
    });

    setBatches(newBatches);
  };

  // Show loading while checking admin status
  if (status === "loading" || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Only show the page if user is admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Upload Questions to Role-Based Collections
          </h1>
          <p className="text-gray-600 mt-1">
            Upload technical questions by role and behavioral questions by trait
            cluster
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Logged in as: {session?.user?.email}
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
            className={`p-4 mb-6 rounded-md whitespace-pre-line ${
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
            Set up common technical roles and all behavioral clusters
          </p>
          <button
            onClick={quickSetupCommonRoles}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Setup Common Collections
          </button>
        </div>

        {/* Batches */}
        <div className="space-y-6">
          {batches.map((batch, index) => (
            <div
              key={batch.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Batch {index + 1}
                </h3>
                {batches.length > 1 && (
                  <button
                    onClick={() => removeBatch(batch.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Collection Type
                  </label>
                  <select
                    value={batch.type}
                    onChange={(e) =>
                      updateBatch(batch.id, {
                        type: e.target.value as "technical" | "qualitative",
                        targetCollection: "",
                        displayName: "",
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="technical">
                      Technical Questions (4 options)
                    </option>
                    <option value="qualitative">
                      Behavioral/Qualitative Questions (5 options - Likert)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Target Collection
                  </label>
                  {batch.type === "technical" ? (
                    <select
                      value={batch.targetCollection}
                      onChange={(e) => {
                        const role = Object.entries(roleToCollection).find(
                          ([_, collection]) => collection === e.target.value
                        )?.[0];
                        updateBatch(batch.id, {
                          targetCollection: e.target.value,
                          displayName: role || e.target.value,
                        });
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select a role...</option>
                      {Object.entries(roleToCollection).map(
                        ([role, collection]) => (
                          <option key={collection} value={collection}>
                            {role}
                          </option>
                        )
                      )}
                    </select>
                  ) : (
                    <select
                      value={batch.targetCollection}
                      onChange={(e) =>
                        updateBatch(batch.id, {
                          targetCollection: e.target.value,
                          displayName: e.target.value.replace(/_/g, " "),
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select a trait cluster...</option>
                      {Object.values(qualitativeClusters).map((cluster) => (
                        <option key={cluster} value={cluster}>
                          {cluster.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={batch.description}
                  onChange={(e) =>
                    updateBatch(batch.id, { description: e.target.value })
                  }
                  placeholder="Brief description of these questions"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Upload JSON File *
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(batch.id, file);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
                {batch.questions.length > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    ✅ {batch.questions.length} questions loaded
                  </p>
                )}
                {uploadProgress[batch.id] > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress[batch.id]}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {uploadProgress[batch.id]}% uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={addNewBatch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Another Batch
          </button>

          <button
            onClick={uploadAllBatches}
            disabled={
              isUploading ||
              batches.every(
                (b) => !b.targetCollection || b.questions.length === 0
              )
            }
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload All Batches to Firestore"}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold mb-2">
              Technical Questions Format (4 options):
            </h4>
            <pre className="text-sm text-gray-600 overflow-x-auto">
              {`[
  {
    "functionalArea": "Engineering",
    "roleTitle": "Software Engineer",
    "questionId": "unique_id",
    "question": "What is...?",
    "options": {
      "a": "Option A",
      "b": "Option B",
      "c": "Option C",
      "d": "Option D"
    },
    "correctOption": "a",
    "level": "easy|medium|advanced"
  }
]`}
            </pre>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold mb-2">
              Behavioral Questions Format (5 options - Likert):
            </h4>
            <pre className="text-sm text-gray-600 overflow-x-auto">
              {`[
  {
    "cluster": "Self-Awareness & Growth Mindset",
    "trait": "Openness to Feedback",
    "questionId": "QUAL_GROWTH_Q1",
    "question": "I listen actively when receiving feedback from others.",
    "options": {
      "a": "Strongly Disagree",
      "b": "Disagree",
      "c": "Neutral",
      "d": "Agree",
      "e": "Strongly Agree"
    },
    "correctOption": "e",
    "scaleType": "Likert"
  }
]`}
            </pre>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-md border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">
            Important Notes:
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>
              • <strong>Technical Questions:</strong> Must have 4 options (a-d)
              and a difficulty level
            </li>
            <li>
              • <strong>Behavioral Questions:</strong> Must have 5 options (a-e)
              with Likert scale
            </li>
            <li>
              • <strong>File Naming:</strong> Use descriptive names like
              software_engineer_tech.json or cognitive_agility_behavioral.json
            </li>
            <li>
              • <strong>Minimum Questions:</strong> Upload at least 50 per
              technical role, 30 per behavioral cluster
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminUploadQuestions;
