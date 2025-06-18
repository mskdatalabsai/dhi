"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Play, CheckCircle, Sun, Moon } from "lucide-react";

const HomePage = () => {
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Check system preference
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const uspPoints = [
    {
      title: "Expert-Led Training",
      description:
        "Learn from industry professionals with 50+ years combined experience from TCS, Oracle, GE, and more.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Hands-On Experience",
      description:
        "Work on real-world projects and get practical skills that make you industry-ready from day one.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Career Development",
      description:
        "Comprehensive support including internships, placement assistance, and ongoing career guidance.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-gray-100 to-slate-50"
      }`}
    >
      {/* Theme Toggle Button */}
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

      {/* Header Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 relative overflow-hidden`}
            >
              {/* Custom SVG Logo */}
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                className="absolute inset-0"
              >
                {/* Background squares transitioning to circles */}
                <defs>
                  <linearGradient
                    id="greenToYellow"
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

                {/* Layer 1 - Largest square (most green) */}
                <rect
                  x="10"
                  y="10"
                  width="25"
                  height="25"
                  fill="#047857"
                  rx="3"
                  opacity="0.8"
                />

                {/* Layer 2 - Medium square transitioning */}
                <rect
                  x="20"
                  y="20"
                  width="20"
                  height="20"
                  fill="#059669"
                  rx="5"
                  opacity="0.9"
                />

                {/* Layer 3 - Smaller square more rounded */}
                <rect
                  x="30"
                  y="30"
                  width="15"
                  height="15"
                  fill="#10b981"
                  rx="7"
                  opacity="0.9"
                />

                {/* Layer 4 - Circle (yellow) */}
                <circle cx="50" cy="25" r="8" fill="#fbbf24" opacity="0.9" />

                {/* Layer 5 - Smaller circle */}
                <circle cx="55" cy="35" r="6" fill="#f59e0b" opacity="0.8" />

                {/* Layer 6 - Smallest circle */}
                <circle cx="45" cy="45" r="4" fill="#eab308" opacity="0.7" />

                {/* Connecting elements */}
                <path
                  d="M35 37 L47 29"
                  stroke="url(#greenToYellow)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <path
                  d="M40 45 L50 30"
                  stroke="url(#greenToYellow)"
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

          {/* Tagline */}
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 mb-6 leading-tight">
            Transform Your Data Science
            <br />
            <span className={isDark ? "text-white" : "text-gray-900"}>
              Career Today
            </span>
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto mb-12 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Master Data Science, Machine Learning, and AI with industry experts.
            Get hands-on experience and emerge as an industry-ready data
            scientist with our comprehensive training programs.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Additional Content */}
          <div className="space-y-8">
            <div
              className={`rounded-2xl p-8 border transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white shadow-lg border-gray-200"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Why Choose MSK Datalabs?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                    50+ Years Combined Experience
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                    Industry-Ready Curriculum
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                    Real-World Projects
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                    Career Placement Support
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - USP Videos and Texts */}
          <div className="space-y-8">
            {uspPoints.map((usp, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  isDark
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                    : "bg-white shadow-lg border-gray-200 hover:shadow-xl"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`relative w-24 h-16 rounded-lg overflow-hidden border ${
                        isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-100 border-gray-200"
                      }`}
                    >
                      <video
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                        poster={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Crect width='100' height='60' fill='${
                          isDark ? "%23374151" : "%23f3f4f6"
                        }'/%3E%3C/svg%3E`}
                      >
                        <source src={usp.videoUrl} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play
                          className={`w-6 h-6 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`text-xl font-semibold mb-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {usp.title}
                    </h4>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {usp.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Form Section */}
        <div className="mt-20">
          <div className="max-w-2xl mx-auto">
            <div
              className={`rounded-2xl p-8 border transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white shadow-lg border-gray-200"
              }`}
            >
              <h3
                className={`text-2xl font-bold text-center mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Start Your Data Science Journey
              </h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      // Navigate to payment page
                      window.location.href = "/payment";
                    }}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Start Free Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
              <p
                className={`text-center text-sm mt-4 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No upfront payment • Free career counseling • Industry expert
                guidance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
