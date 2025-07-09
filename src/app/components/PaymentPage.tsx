"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BenefitsCard from "@/components/BenefitsCard";
import AssessmentPreview from "@/components/AssessmentPreview";
import SecurePaymentCard from "@/components/SecurePaymentCard";

const PaymentPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setIsDark(savedTheme === "dark");

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay script");
    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <div className="container mx-auto px-6 py-12 max-w-6xl pt-32">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Complete Your Payment
          </h2>
          <p className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Pay ₹99 to unlock your AI-powered career assessment
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <BenefitsCard isDark={isDark} />
            <AssessmentPreview isDark={isDark} />
          </div>
          <div className="space-y-6">
            <SecurePaymentCard isDark={isDark} razorpayLoaded={razorpayLoaded} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
