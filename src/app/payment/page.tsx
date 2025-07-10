/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import BenefitsCard from "../components/BenefitsCard";
import AssessmentPreview from "../components/AssessmentPreview";
import SecurePaymentCard from "../components/SecurePaymentCard";

const PaymentPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }

    // Check authentication first
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      // Check if user has already paid
      checkPaymentStatus();
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay script");
    document.body.appendChild(script);

    // ✅ Proper cleanup function
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [status, router]);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch("/api/payment/status");
      const data = await response.json();

      if (data.hasPaid) {
        // User has already paid, redirect to profile
        router.push("/profile");
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error checking payment status:", error);
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Show loading screen while checking authentication and payment status
  if (status === "loading" || isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <svg
            className="animate-spin w-12 h-12 mx-auto mb-4 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if unauthenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Top Navigation */}
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl pt-32">
        <div className="text-center mb-12">
          <h2
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Complete Your Payment
          </h2>
          <p
            className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Pay ₹99 to unlock your AI-powered career assessment
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <BenefitsCard isDark={isDark} />
            <AssessmentPreview isDark={isDark} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SecurePaymentCard
              isDark={isDark}
              razorpayLoaded={razorpayLoaded}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
