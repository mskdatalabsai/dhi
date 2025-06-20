"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Target, BookOpen, User } from "lucide-react";
import Navbar from "./components/navbar";
import LandHero from "./components/hero";
import Stats from "./components/stats";

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

  return (
    <>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
            : "bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50"
        }`}
      >
        {/* Main Content */}
        <div className="container mx-auto px-6 pt-24 pb-16 max-w-7xl">
          {/* Hero Section */}
          <LandHero isDark={isDark} />
          {/* Stats Bar */}
          <Stats isDark={isDark} />

          {/* Main Features Grid */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Why Choose Our AI Assessment Platform
              </h2>
              <p
                className={`text-lg max-w-3xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Science-backed assessments combined with machine learning to
                predict your ideal career path
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div
                className={`rounded-xl p-8 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200 shadow-lg"
                }`}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-emerald-600" />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Precision Matching
                </h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Our AI analyzes 50+ data points to match you with roles where
                  you&apos;ll excel, saving months of trial and error.
                </p>
              </div>

              <div
                className={`rounded-xl p-8 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200 shadow-lg"
                }`}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-emerald-600" />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Personalized Learning Path
                </h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Get a customized roadmap with specific skills, certifications,
                  and projects tailored to your target role.
                </p>
              </div>

              <div
                className={`rounded-xl p-8 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200 shadow-lg"
                }`}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <User className="w-7 h-7 text-emerald-600" />
                </div>
                <h3
                  className={`text-xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Expert Guidance
                </h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Connect with industry mentors and get placement support from
                  professionals at top tech companies.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <section className="mb-24" id="how-it-works">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                How Our AI Assessment Works
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Advanced algorithms analyze your skills, experience, and career
                goals to provide personalized recommendations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div
                className={`p-10 rounded-2xl shadow-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-emerald-600">1</span>
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Assessment Test
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Take our comprehensive AI-powered assessment that evaluates
                  your technical skills, personality traits, and career
                  preferences
                </p>
              </div>

              <div
                className={`p-10 rounded-2xl shadow-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-emerald-600">2</span>
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  AI Analysis
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Our machine learning algorithms process your data against
                  thousands of successful career paths and industry requirements
                </p>
              </div>

              <div
                className={`p-10 rounded-2xl shadow-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-emerald-600">3</span>
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Personalized Plan
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Receive a customized learning path, role recommendations, and
                  career roadmap tailored specifically to your profile
                </p>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Success Stories
              </h2>
              <p
                className={`text-xl ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                See how our AI assessment transformed careers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p
                  className={`mb-6 italic leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  &quot;The AI assessment identified my perfect role match. I
                  got placed as a Data Scientist at Google within 3
                  months!&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">AS</span>
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Anish Sharma
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Data Scientist at Google
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p
                  className={`mb-6 italic leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  &quot;Amazing accuracy! The assessment predicted my success in
                  ML Engineering. Now earning 80% more than before.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">PS</span>
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Priya Singh
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      ML Engineer at Microsoft
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p
                  className={`mb-6 italic leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  &quot;Saved months of career confusion. The AI showed me
                  exactly which skills to develop for my dream role.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">RK</span>
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Rahul Kumar
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Senior Analyst at Amazon
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="mb-24">
            <div
              className={`rounded-2xl p-12 ${
                isDark ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-center text-sm font-medium mb-8 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                TRUSTED BY PROFESSIONALS FROM
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-70">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Google
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Microsoft
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Amazon
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Meta
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Apple
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  How accurate is the AI assessment?
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Our AI assessment has 95% accuracy based on analysis of over
                  50,000 successful career transitions. It uses advanced machine
                  learning algorithms trained on industry data and successful
                  placement patterns.
                </p>
              </div>

              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  How much time does the assessment save?
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Our clients save an average of 70% of time typically spent on
                  career exploration and role matching. What used to take months
                  now takes weeks with our AI-powered insights.
                </p>
              </div>

              <div
                className={`p-8 rounded-2xl shadow-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  What makes this different from other assessments?
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Unlike traditional assessments, our AI analyzes your complete
                  profile against real industry data, current market trends, and
                  successful career patterns to provide actionable, personalized
                  recommendations.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Form Section */}
          <section className="mt-24" id="cta-form">
            <div className="max-w-3xl mx-auto">
              <div
                className={`rounded-3xl p-12 shadow-2xl border ${
                  isDark
                    ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                    : "bg-gradient-to-br from-white to-gray-50 border-gray-100"
                }`}
              >
                <h2
                  className={`text-3xl md:text-4xl font-bold text-center mb-8 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Start Your Data Science Journey
                </h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => (window.location.href = "/payment")}
                      className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
                    >
                      Start Free Consultation
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p
                  className={`text-center mt-6 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No upfront payment • Free career counseling • Industry expert
                  guidance
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HomePage;
