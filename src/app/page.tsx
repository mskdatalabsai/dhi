"use client";

import React, { useState } from "react";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import Navbar from "./components/navbar";

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });

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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50">
        {/* Main Content */}
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Transform Your Data Science
              </span>
              <br />
              <span className="text-gray-900">Career Today</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-600 leading-relaxed mb-10">
              Master Data Science, Machine Learning, and AI with industry
              experts. Get hands-on experience and emerge as an industry-ready
              data scientist with our comprehensive training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => (window.location.href = "/payment")}
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                Start Your AI Assessment
                <ArrowRight className="ml-3 w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("cta-form");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center px-8 py-5 bg-white text-emerald-600 text-lg font-semibold rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                Learn More
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>5,000+ Successful Placements</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>95% Assessment Accuracy</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-24">
            {/* Left Side - Key Benefits */}
            <div>
              <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-100">
                <h3 className="text-3xl font-bold mb-6 text-gray-900">
                  AI-Powered Career Assessment
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-lg text-gray-700">
                      Logic-Based Role Matching
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-lg text-gray-700">
                      Heuristic AI Analysis
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-lg text-gray-700">
                      Save 70% Assessment Time
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-lg text-gray-700">
                      Data-Driven Career Insights
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - USP Points */}
            <div className="space-y-6">
              {uspPoints.map((usp, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <video
                          className="w-full h-full object-cover"
                          muted
                          loop
                          autoPlay
                          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Crect width='100' height='60' fill='%23f3f4f6'/%3E%3C/svg%3E"
                        >
                          <source src={usp.videoUrl} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-8 h-8 text-gray-600 opacity-50" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2 text-gray-900">
                        {usp.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {usp.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                How Our AI Assessment Works
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-600">
                Advanced algorithms analyze your skills, experience, and career
                goals to provide personalized recommendations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-emerald-600">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Assessment Test
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Take our comprehensive AI-powered assessment that evaluates
                  your technical skills, personality traits, and career
                  preferences
                </p>
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-emerald-600">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  AI Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our machine learning algorithms process your data against
                  thousands of successful career paths and industry requirements
                </p>
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-emerald-600">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Personalized Plan
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive a customized learning path, role recommendations, and
                  career roadmap tailored specifically to your profile
                </p>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="mb-24">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-16 border border-emerald-100">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Proven Results Through AI Assessment
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Data-driven insights that save time and money while maximizing
                  career success
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-emerald-600 mb-3">
                    95%
                  </div>
                  <div className="text-lg font-medium text-gray-700">
                    Assessment Accuracy
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-emerald-600 mb-3">
                    70%
                  </div>
                  <div className="text-lg font-medium text-gray-700">
                    Time Saved
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-emerald-600 mb-3">
                    5000+
                  </div>
                  <div className="text-lg font-medium text-gray-700">
                    Successful Placements
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-emerald-600 mb-3">
                    $50K
                  </div>
                  <div className="text-lg font-medium text-gray-700">
                    Avg. Salary Increase
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                See how our AI assessment transformed careers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
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
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  &quot;The AI assessment identified my perfect role match. I
                  got placed as a Data Scientist at Google within 3
                  months!&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Anish Sharma
                    </div>
                    <div className="text-sm text-gray-500">
                      Data Scientist at Google
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
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
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  &quot;Amazing accuracy! The assessment predicted my success in
                  ML Engineering. Now earning 80% more than before.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">PS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Priya Singh
                    </div>
                    <div className="text-sm text-gray-500">
                      ML Engineer at Microsoft
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
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
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  &quot;Saved months of career confusion. The AI showed me
                  exactly which skills to develop for my dream role.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">RK</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Rahul Kumar
                    </div>
                    <div className="text-sm text-gray-500">
                      Senior Analyst at Amazon
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="mb-24">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-600 mb-8">
                Trusted by professionals from leading companies
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <div className="text-2xl font-bold text-gray-400">Google</div>
                <div className="text-2xl font-bold text-gray-400">
                  Microsoft
                </div>
                <div className="text-2xl font-bold text-gray-400">Amazon</div>
                <div className="text-2xl font-bold text-gray-400">Netflix</div>
                <div className="text-2xl font-bold text-gray-400">Meta</div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  How accurate is the AI assessment?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI assessment has 95% accuracy based on analysis of over
                  50,000 successful career transitions. It uses advanced machine
                  learning algorithms trained on industry data and successful
                  placement patterns.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  How much time does the assessment save?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our clients save an average of 70% of time typically spent on
                  career exploration and role matching. What used to take months
                  now takes weeks with our AI-powered insights.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  What makes this different from other assessments?
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl border border-gray-100">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
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
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                <p className="text-center text-gray-500 mt-6">
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
