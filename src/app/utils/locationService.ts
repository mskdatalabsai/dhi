import { IpapiResponse, LocationData } from "../types/pricing";

class LocationDetectionError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "LocationDetectionError";
  }
}

export class LocationService {
  private static readonly API_URL = "https://ipapi.co/json/";
  private static readonly TIMEOUT = 5000; // 5 seconds

  static async detectLocation(): Promise<LocationData> {
    try {
      // Create timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(this.API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; RegionalPricing/1.0)",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new LocationDetectionError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          "HTTP_ERROR"
        );
      }

      const data: IpapiResponse = await response.json();

      // Check for API errors
      if (data.error) {
        throw new LocationDetectionError(
          data.reason || "API returned an error",
          "API_ERROR"
        );
      }

      // Validate required fields
      if (!data.country_code || !data.country_name) {
        throw new LocationDetectionError(
          "Invalid response: missing country data",
          "INVALID_RESPONSE"
        );
      }

      return {
        country_code: data.country_code,
        country_name: data.country_name,
        city: data.city || "",
        region: data.region || "",
        currency: data.currency || "",
        timezone: data.timezone || "",
      };
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new LocationDetectionError("Request timed out", "TIMEOUT");
      }

      if (error instanceof LocationDetectionError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      throw new LocationDetectionError(
        `Network error: ${message}`,
        "NETWORK_ERROR"
      );
    }
  }

  // Test method for development
  static async testConnection(): Promise<boolean> {
    try {
      await this.detectLocation();
      return true;
    } catch (error) {
      console.error("ipapi.co connection test failed:", error);
      return false;
    }
  }
}
