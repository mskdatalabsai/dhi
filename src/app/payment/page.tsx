"use client";

import React, { useState, useEffect } from "react";
import { Check, Sun, Moon } from "lucide-react";

const PaymentPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
  });

  // Load theme on component mount
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

  // Payment plans
  const pricingPlans = [
    {
      id: "starter",
      name: "Starter",
      price: 29,
      period: "month",
      features: [
        "Basic Analytics",
        "Email Support",
        "5 Team Members",
        "10GB Storage",
      ],
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: 79,
      period: "month",
      features: [
        "Advanced Analytics",
        "Priority Support",
        "25 Team Members",
        "100GB Storage",
        "API Access",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      period: "month",
      features: [
        "Custom Analytics",
        "24/7 Phone Support",
        "Unlimited Team Members",
        "1TB Storage",
        "Custom Integrations",
        "Dedicated Manager",
      ],
      popular: false,
    },
  ];

  interface PaymentData {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    billingAddress: string;
    city: string;
    zipCode: string;
    country: string;
  }

  interface PricingPlan {
    id: string;
    name: string;
    price: number;
    period: string;
    features: string[];
    popular: boolean;
  }

  const handlePaymentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPaymentData((prev: PaymentData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPlan) {
      alert("Please select a plan first");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalData = {
        userId: "user_" + Date.now(),
        timestamp: new Date().toISOString(),
        selectedPlan: selectedPlan,
        paymentData: paymentData,
        completedAt: new Date().toISOString(),
      };

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log("Payment submitted:", finalData);

      // Redirect to survey after successful payment
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
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDark
              ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
              : "bg-white hover:bg-gray-50 text-gray-600 shadow-lg"
          }`}
        >
          {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Choose Your Plan
          </h1>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Start your free trial and unlock the full potential of your business
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 border-2 cursor-pointer transition-all duration-300 ${
                selectedPlan?.id === plan.id
                  ? "border-blue-500 shadow-xl scale-105"
                  : isDark
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-200 hover:border-gray-300"
              } ${isDark ? "bg-gray-800" : "bg-white"} ${
                plan.popular ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span
                    className={`text-4xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`text-lg ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  selectedPlan?.id === plan.id
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Form */}
        {selectedPlan && (
          <div
            className={`rounded-2xl p-8 border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } shadow-xl`}
          >
            <h3
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Payment Information
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
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
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="1234 5678 9012 3456"
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
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="MM/YY"
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
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Billing Address
                  </label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={paymentData.billingAddress}
                    onChange={handlePaymentInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={paymentData.city}
                      onChange={handlePaymentInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={paymentData.zipCode}
                      onChange={handlePaymentInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Country
                  </label>
                  <select
                    name="country"
                    value={paymentData.country}
                    onChange={handlePaymentInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              className={`mt-8 pt-6 border-t ${
                isDark ? "border-gray-600" : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div
                  className={`text-lg ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="font-medium">{selectedPlan.name} Plan</span>
                  <div className="text-sm">
                    Billed monthly • 14-day free trial
                  </div>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${selectedPlan.price}/month
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => (window.location.href = "/")}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Back to Home
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    `Start Free Trial - $${selectedPlan.price}/month`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
