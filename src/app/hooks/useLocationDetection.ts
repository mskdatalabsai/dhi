/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { LocationData } from "../types/pricing";
import { LocationService } from "../utils/locationService";

interface UseLocationDetectionOptions {
  autoDetect?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseLocationDetectionResult {
  locationData: LocationData | null;
  isLoading: boolean;
  error: string | null;
  isIndia: boolean | null;
  retry: () => void;
  detectLocation: () => Promise<void>;
}

export function useLocationDetection(
  options: UseLocationDetectionOptions = {}
): UseLocationDetectionResult {
  const { autoDetect = true, retryAttempts = 2, retryDelay = 1000 } = options;

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(autoDetect);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const detectLocation = useCallback(async (): Promise<void> => {
    if (attemptCount >= retryAttempts) {
      setError("Maximum retry attempts exceeded");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Add delay for retries
      if (attemptCount > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attemptCount)
        );
      }

      const data = await LocationService.detectLocation();

      setLocationData(data);
      setError(null);

      // Log successful detection for debugging
      console.log("✅ Location detected:", {
        country: data.country_name,
        code: data.country_code,
        city: data.city,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to detect location";
      setError(errorMessage);
      setAttemptCount((prev) => prev + 1);

      console.warn("❌ Location detection failed:", {
        attempt: attemptCount + 1,
        error: errorMessage,
        code: err.code,
      });

      // Retry automatically if under limit
      if (attemptCount + 1 < retryAttempts) {
        setTimeout(() => {
          detectLocation();
        }, retryDelay * (attemptCount + 1));
        return; // Don't set loading to false yet
      }
    } finally {
      setIsLoading(false);
    }
  }, [attemptCount, retryAttempts, retryDelay]);

  const retry = useCallback(() => {
    setAttemptCount(0);
    setError(null);
    detectLocation();
  }, [detectLocation]);

  useEffect(() => {
    if (autoDetect) {
      detectLocation();
    }
  }, [autoDetect]); // Only depend on autoDetect

  const isIndia =
    locationData?.country_code === "IN"
      ? true
      : locationData?.country_code
      ? false
      : null;

  return {
    locationData,
    isLoading,
    error,
    isIndia,
    retry,
    detectLocation,
  };
}
