"use client";

import React, { useState, useEffect } from "react";
import { Check, Sun, Moon, Users, Award, Target } from "lucide-react";

const PaymentPage = () => {
  const [isDark, setIsDark] = useState(false);
  type PricingPlan = (typeof pricingPlans)[number];
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
  // Payment plans with more detailed information
  const pricingPlans = [
    {
      id: "beginner",
      name: "Data Science Foundations",
      price: 299,
      originalPrice: 399,
      period: "course",
      duration: "6 weeks",
      features: [
        "Python Programming Fundamentals",
        "Statistics & Probability",
        "Data Analysis with Pandas",
        "Data Visualization",
        "Basic SQL Database",
        "Jupyter Notebooks Mastery",
        "3 Hands-on Projects",
        "Course Completion Certificate",
        "Lifetime Access to Materials",
      ],
      popular: false,
      level: "Beginner",
    },
    {
      id: "professional",
      name: "Complete Data Science Bootcamp",
      price: 799,
      originalPrice: 1199,
      period: "bootcamp",
      duration: "16 weeks",
      features: [
        "Everything in Foundations",
        "Machine Learning Algorithms",
        "Advanced Analytics",
        "Deep Learning Basics",
        "Real Industry Projects",
        "Personal Mentorship",
        "Career Guidance & Resume Review",
        "Interview Preparation",
        "Internship Opportunities",
        "Job Placement Assistance",
        "6 months post-course support",
      ],
      popular: true,
      level: "Intermediate to Advanced",
    },
    {
      id: "master",
      name: "AI & ML Mastery Program",
      price: 1299,
      originalPrice: 1799,
      period: "program",
      duration: "24 weeks",
      features: [
        "Everything in Bootcamp",
        "Advanced Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "MLOps & Model Deployment",
        "Research Project Collaboration",
        "Industry Partnership Projects",
        "Guaranteed Job Placement*",
        "1-year continuous mentorship",
        "Access to MSK Alumni Network",
        "Conference & Workshop Invitations",
      ],
      popular: false,
      level: "Advanced & Professional",
    },
  ];

  const handlePaymentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
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
          <div className="mb-6">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 mx-auto relative overflow-hidden`}
            >
              {/* Custom SVG Logo */}
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                className="absolute inset-0"
              >
                <defs>
                  <linearGradient
                    id="greenToYellowPayment"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>

                <rect
                  x="10"
                  y="10"
                  width="25"
                  height="25"
                  fill="#047857"
                  rx="3"
                  opacity="0.8"
                />
                <rect
                  x="20"
                  y="20"
                  width="20"
                  height="20"
                  fill="#059669"
                  rx="5"
                  opacity="0.9"
                />
                <rect
                  x="30"
                  y="30"
                  width="15"
                  height="15"
                  fill="#10b981"
                  rx="7"
                  opacity="0.9"
                />
                <circle cx="50" cy="25" r="8" fill="#fbbf24" opacity="0.9" />
                <circle cx="55" cy="35" r="6" fill="#f59e0b" opacity="0.8" />
                <circle cx="45" cy="45" r="4" fill="#eab308" opacity="0.7" />
                <path
                  d="M35 37 L47 29"
                  stroke="url(#greenToYellowPayment)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <path
                  d="M40 45 L50 30"
                  stroke="url(#greenToYellowPayment)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
              </svg>
            </div>
            <h1
              className={`text-4xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              MSK DATALABS.AI
            </h1>
            <p className="text-sm text-gray-500 font-medium italic">
              acquire indefinitely...
            </p>
          </div>
          <h2
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Choose Your Learning Plan
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Start your data science journey with the perfect training program
            designed by industry experts from TCS, Oracle, GE, ESPN, and more.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 border-2 cursor-pointer transition-all duration-300 ${
                selectedPlan?.id === plan.id
                  ? "border-emerald-600 shadow-xl scale-105"
                  : isDark
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-200 hover:border-gray-300"
              } ${isDark ? "bg-gray-800" : "bg-white"} ${
                plan.popular ? "ring-2 ring-emerald-600" : ""
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
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white"
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

        {/* Why Choose MSK Datalabs */}
        <div
          className={`rounded-2xl p-8 mb-12 border transition-colors duration-300 ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white shadow-lg border-gray-200"
          }`}
        >
          <h3
            className={`text-3xl font-bold text-center mb-8 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Why Choose MSK Datalabs?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h4
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Expert Instructors
              </h4>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Learn from industry professionals with 50+ years combined
                experience from top companies like TCS, Oracle, GE, and ESPN.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h4
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Proven Results
              </h4>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                85% job placement rate with 2000+ successful graduates now
                working at leading tech companies worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h4
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Career Focus
              </h4>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Industry-aligned curriculum with hands-on projects, mentorship,
                and dedicated career support for guaranteed success.
              </p>
            </div>
          </div>
        </div>
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
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
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
