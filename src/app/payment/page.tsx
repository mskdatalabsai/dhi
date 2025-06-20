"use client";

import React, { useState, useEffect } from "react";
import { Check, CreditCard, Shield, Clock } from "lucide-react";
import Navbar from "../components/navbar"; // Import the Navbar component

const PaymentPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setPaymentData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "expiryDate") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substr(0, 5);
      setPaymentData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "cvv") {
      const formatted = value.replace(/\D/g, "").substr(0, 3);
      setPaymentData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setPaymentData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentSubmit = async () => {
    if (
      !paymentData.cardholderName ||
      !paymentData.cardNumber ||
      !paymentData.expiryDate ||
      !paymentData.cvv
    ) {
      alert("Please fill in all payment details");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalData = {
        userId: "user_" + Date.now(),
        timestamp: new Date().toISOString(),
        assessmentFee: 99,
        paymentData: paymentData,
        completedAt: new Date().toISOString(),
      };

      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Payment submitted:", finalData);
      window.location.href = "/survey";
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Use the imported Navbar component */}
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Content - Add padding-top to account for fixed navbar */}
      <div className="container mx-auto px-6 py-12 max-w-4xl pt-32">
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

        {/* Benefits Section */}
        <div
          className={`rounded-2xl p-8 mb-8 border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } shadow-lg`}
        >
          <h3
            className={`text-2xl font-bold mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            What You&apos;ll Get
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4
                  className={`font-semibold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Comprehensive AI Assessment
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Advanced algorithms analyze your skills, experience, and
                  career goals
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4
                  className={`font-semibold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Personalized Career Roadmap
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Get a customized learning path tailored to your target role
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4
                  className={`font-semibold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Industry Insights
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Receive recommendations based on current market trends and
                  demands
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div
          className={`rounded-2xl p-8 border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } shadow-xl`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Payment Details
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={paymentData.cardholderName}
                onChange={handlePaymentInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handlePaymentInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handlePaymentInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>

            {/* Security Notice */}
            <div
              className={`flex items-center space-x-2 p-4 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <Shield className="w-5 h-5 text-emerald-600" />
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Your payment information is securely processed.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePaymentSubmit}
              disabled={isSubmitting}
              className={`w-full mt-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
                isSubmitting
                  ? "bg-emerald-300 text-white cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Pay ₹99"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
