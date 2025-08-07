/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ErrorBoundary.tsx

import {
  IntentDetectionResult,
  ProfileData,
  SurveyQuestion,
} from "@/types/quiz";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Send to error tracking service (e.g., Sentry)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                We&apos;re sorry for the inconvenience. Please try refreshing
                the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// utils/errorHandling.ts

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const handleAPIError = (error: any): APIError => {
  if (error instanceof APIError) {
    return error;
  }

  if (error.response) {
    // Server responded with error
    return new APIError(
      error.response.data?.message || "Server error",
      error.response.status,
      error.response.data?.code
    );
  } else if (error.request) {
    // Request made but no response
    return new APIError("Network error", 0, "NETWORK_ERROR");
  } else {
    // Something else happened
    return new APIError(error.message || "Unknown error", 0, "UNKNOWN_ERROR");
  }
};

// Wrap your app in _app.tsx or layout.tsx
// Remove this import to avoid conflict, since ErrorBoundary is already defined in this file
// (No import needed here)

type ErrorBoundaryWrapperProps = {
  children: React.ReactNode;
};

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}

// utils/retryLogic.ts

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

// Example usage in questionService.ts
export class QuestionService {
  static async getIntentBasedQuestions(
    profileData: ProfileData,
    options: { useAIOptimization?: boolean } = {}
  ): Promise<{
    questions: SurveyQuestion[];
    intent: IntentDetectionResult;
    metadata: any;
  }> {
    return await retryWithBackoff(async () => {
      const response = await fetch("/api/intent/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new APIError("Failed to detect intent", response.status);
      }

      const data = await response.json();
      return {
        questions: data.questions,
        intent: data.intent,
        metadata: data.metadata,
      };

      // ... rest of implementation
    });
  }
}
