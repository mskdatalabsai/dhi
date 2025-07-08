/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Check, CreditCard, Shield, Clock, Eye } from "lucide-react";
import Navbar from "../components/Navbar"; // Import the Navbar component

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay script");
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order data
      const orderData = {
        amount: 9900, // Amount in paisa (₹99)
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      };

      // In a real app, you would call your backend to create an order
      // For demo purposes, we'll use test data
      const options = {
        key: "rzp_test_Hg09l83CTDK2mA", // Test API Key - replace with your test key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AI Career Assessment",
        description: "Career Assessment Fee",
        image: "/logo.png", // Add your logo URL
        // order_id: "order_" + Date.now(), // In real app, get this from backend
        handler: function (response: any) {
          // Payment success callback
          console.log("Payment Success:", response);
          handlePaymentSuccess(response);
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Corporate Office",
        },
        theme: {
          color: "#059669", // Emerald-600 to match your design
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            console.log("Payment modal closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        // Payment failure callback
        console.log("Payment Failed:", response);
        handlePaymentFailure(response);
      });

      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Process successful payment
      const finalData = {
        userId: "user_" + Date.now(),
        timestamp: new Date().toISOString(),
        assessmentFee: 99,
        paymentData: {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        },
        completedAt: new Date().toISOString(),
      };

      // In a real app, verify payment on your backend
      console.log("Payment completed:", finalData);

      // Simulate backend verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Payment successful! Redirecting to assessment...");
      window.location.href = "/profile";
    } catch (error) {
      console.error("Error processing successful payment:", error);
      alert(
        "Payment was successful but there was an error. Please contact support."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentFailure = (response: any) => {
    console.error("Payment failed:", response);
    alert("Payment failed. Please try again.");
    setIsSubmitting(false);
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
          {/* Left Column - Benefits First, then Assessment Preview */}
          <div className="space-y-8">
            {/* Benefits Section - FIRST */}
            <div
              className={`rounded-2xl p-8 border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
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
                  <Check className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
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
                  <Check className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
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
                      Get a customized learning path tailored to your target
                      role
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
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

            {/* Assessment Preview Section - SECOND */}
            <div
              className={`rounded-2xl p-8 border ${
                isDark
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                  : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
              } shadow-xl`}
            >
              {/* Preview Label */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg mb-6 w-fit">
                <Eye className="w-4 h-4" />
                <span>Assessment Preview</span>
              </div>

              {/* Mock Assessment Interface */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    AI Career Assessment
                  </h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    In Progress
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-teal-600 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Step 3 of 5: Technical Skills Assessment
                </p>
              </div>

              {/* Mock Question */}
              <div
                className={`p-6 rounded-xl mb-4 ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p
                  className={`font-medium mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Which machine learning framework are you most proficient in?
                </p>
                <div className="space-y-3">
                  {["TensorFlow", "PyTorch", "Scikit-learn", "Keras"].map(
                    (option, i) => (
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
                                <div className="w-2 h-2 bg-white rounded-full"></div>
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
                    )
                  )}
                </div>
              </div>

              {/* Mock Results Preview */}
              <div
                className={`text-center p-4 rounded-xl ${
                  isDark ? "bg-gray-700/50" : "bg-purple-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-purple-400" : "text-purple-700"
                  }`}
                >
                  AI Prediction: 92% match for ML Engineer roles
                </p>
              </div>

              {/* Bottom Caption */}
              <div className="text-center mt-4">
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ↑ This is how our assessment interface looks
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Section */}
          <div className="space-y-6">
            {/* Payment Section */}
            <div
              className={`rounded-2xl p-8 border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } shadow-xl`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-6 h-6 text-purple-600" />
                <h3
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Secure Payment
                </h3>
              </div>

              {/* Payment Amount Display */}
              <div
                className={`text-center py-8 px-6 rounded-lg mb-6 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₹99
                </div>
                <p
                  className={`text-lg ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  One-time assessment fee
                </p>
              </div>

              {/* Test Payment Info */}
              <div
                className={`p-4 rounded-lg mb-6 border-l-4 border-teal-500 ${
                  isDark ? "bg-teal-900/20" : "bg-teal-50"
                }`}
              >
                <h4
                  className={`font-semibold mb-2 ${
                    isDark ? "text-teal-300" : "text-teal-800"
                  }`}
                >
                  Test Mode Information
                </h4>
                <p
                  className={`text-sm mb-2 ${
                    isDark ? "text-teal-200" : "text-teal-700"
                  }`}
                >
                  This is a test payment. Use these test card details:
                </p>
                <ul
                  className={`text-sm space-y-1 ${
                    isDark ? "text-teal-200" : "text-teal-700"
                  }`}
                >
                  <li>• Card Number: 4111 1111 1111 1111</li>
                  <li>• Expiry: Any future date</li>
                  <li>• CVV: Any 3 digits</li>
                  <li>• Name: Any name</li>
                </ul>
              </div>

              {/* Security Notice */}
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg mb-6 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <Shield className="w-5 h-5 text-teal-600" />
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Your payment is secured by Razorpay with 256-bit SSL
                  encryption.
                </p>
              </div>

              {/* Payment Button */}
              <button
                type="button"
                onClick={handleRazorpayPayment}
                disabled={isSubmitting || !razorpayLoaded}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  isSubmitting || !razorpayLoaded
                    ? "bg-purple-300 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white hover:shadow-lg transform hover:scale-[1.02]"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </span>
                ) : !razorpayLoaded ? (
                  "Loading Payment System..."
                ) : (
                  <>
                    <span className="flex items-center justify-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay ₹99 with Razorpay
                    </span>
                  </>
                )}
              </button>

              {/* Powered by Razorpay */}
              <div className="text-center mt-4">
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Powered by{" "}
                  <span className="font-semibold text-[#3395ff]">Razorpay</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
