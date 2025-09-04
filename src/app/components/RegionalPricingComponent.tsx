import React from "react";
import {
  ArrowRight,
  MapPin,
  Globe,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useLocationDetection } from "../hooks/useLocationDetection";
import { PricingData } from "../types/pricing";

interface RegionalPricingProps {
  isDark?: boolean;
  onPurchaseClick?: (countryCode: string | null) => void;
}

const RegionalPricingComponent: React.FC<RegionalPricingProps> = ({
  isDark = false,
  onPurchaseClick,
}) => {
  const { locationData, isLoading, error, isIndia, retry } =
    useLocationDetection({
      autoDetect: true,
      retryAttempts: 3,
      retryDelay: 1000,
    });

  const getPricingData = (): PricingData => {
    if (isIndia) {
      return {
        currency: "₹",
        price: "95",
        region: locationData?.country_name || "India",
        message: "A small investment today. A lifetime of clarity tomorrow.",
        buttonText: "Unlock My Career Path",
      };
    } else {
      return {
        currency: "$",
        price: "5",
        region: locationData?.country_name || "International",
        message: "One small step today. A lifetime of career clarity tomorrow.",
        buttonText: "Start Your Assessment →",
      };
    }
  };

  const pricingData = getPricingData();

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            🌍 Detecting your location...
          </p>
          <p
            className={`text-sm mt-2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            This helps us show you the right pricing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      } p-6`}
    >
      <div className="max-w-2xl mx-auto py-12">
        {/* Region Indicator */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border shadow-sm`}
          >
            {isIndia ? (
              <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            ) : (
              <Globe className="w-4 h-4 mr-2 text-blue-500" />
            )}
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Pricing for: {pricingData.region}
              {locationData?.city && (
                <span className="ml-1 opacity-75">• {locationData.city}</span>
              )}
            </span>
          </div>

          {/* Error state with retry */}
          {error && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                isDark
                  ? "bg-yellow-900/20 border-yellow-500/30"
                  : "bg-yellow-50 border-yellow-200"
              } border flex items-center justify-center space-x-2`}
            >
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span
                className={`text-sm ${
                  isDark ? "text-yellow-400" : "text-yellow-700"
                }`}
              >
                Location detection failed - showing international pricing
              </span>
              <button
                onClick={retry}
                className="ml-2 p-1 hover:bg-yellow-200/50 rounded transition-colors"
                title="Retry location detection"
              >
                <RefreshCw className="w-3 h-3 text-yellow-500" />
              </button>
            </div>
          )}
        </div>

        {/* Pricing Card */}
        <div
          className={`rounded-3xl overflow-hidden shadow-2xl ${
            isDark
              ? "bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700"
              : "bg-white border-gray-100"
          } border`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-teal-600 p-8 text-center">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">💰 Assessment Package</h2>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {pricingData.currency}
                  {pricingData.price}
                </span>
                <span className="text-xl ml-2 opacity-90">Only</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="p-8">
            <div className="space-y-4 mb-8">
              <div
                className={`flex items-center ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <span className="text-2xl mr-3">📋</span>
                <span className="text-lg font-semibold">
                  55 Curated Questions
                </span>
              </div>

              <div
                className={`flex items-center ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <span className="text-2xl mr-3">⏱️</span>
                <span className="text-lg font-semibold">
                  35 Minutes to complete
                </span>
              </div>

              <div
                className={`flex items-center ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <span className="text-2xl mr-3">📊</span>
                <span className="text-lg font-semibold">
                  15 Deep Insights into your strengths & fit
                </span>
              </div>

              <div
                className={`flex items-center ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <span className="text-2xl mr-3">🎯</span>
                <span className="text-lg font-semibold">
                  5 Tailored Career Recommendations
                </span>
              </div>
            </div>

            {/* Value Proposition */}
            <div
              className={`text-center p-6 rounded-2xl ${
                isDark
                  ? "bg-gradient-to-r from-purple-900/30 to-teal-900/30 border-purple-500/30"
                  : "bg-gradient-to-r from-purple-50 to-teal-50 border-purple-200/50"
              } border mb-8`}
            >
              <p
                className={`text-lg font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                💡 <em>{pricingData.message}</em>
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() =>
                onPurchaseClick?.(locationData?.country_code || null)
              }
              className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white text-xl font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center group"
            >
              {pricingData.buttonText}
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-8 space-y-4">
          <div
            className={`flex items-center justify-center space-x-6 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <div className="flex items-center">
              <span className="text-green-500 mr-1">🔒</span>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-1">⭐</span>
              <span className="text-sm">4.9/5 Rating</span>
            </div>
            <div className="flex items-center">
              <span className="text-purple-500 mr-1">👥</span>
              <span className="text-sm">10K+ Users</span>
            </div>
          </div>

          {/* Privacy Notice */}
          <p
            className={`text-xs ${
              isDark ? "text-gray-500" : "text-gray-400"
            } max-w-md mx-auto`}
          >
            🌍 Powered by ipapi.co • We use your IP to show regional pricing •
            No personal data stored
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegionalPricingComponent;
