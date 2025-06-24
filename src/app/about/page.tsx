"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Target,
  TrendingUp,
  Brain,
  Users,
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";

const AboutUsPage = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const stats = [
    { icon: TrendingUp, number: "19M", label: "New Jobs by 2030" },
    { icon: Users, number: "60%", label: "Workforce Needs Upskilling" },
    { icon: Zap, number: "9M", label: "Jobs Being Displaced" },
    { icon: Globe, number: "2025", label: "The AI Revolution Year" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-32 pb-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
              DHITI.AI
            </span>
          </h1>
          <p
            className={`text-xl leading-relaxed max-w-3xl mx-auto ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Pioneering the future of IT career guidance through the power of
            Generative AI
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } shadow-sm hover:shadow-lg transition-all duration-300`}
            >
              <stat.icon
                className={`w-8 h-8 mx-auto mb-4 ${
                  index % 2 === 0 ? "text-purple-600" : "text-teal-600"
                }`}
              />
              <div className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                {stat.number}
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Background Section */}
        <div className="mb-24">
          <div
            className={`rounded-2xl p-8 md:p-12 border ${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            } shadow-lg`}
          >
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-teal-500 rounded-xl flex items-center justify-center mr-6">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  className={`text-3xl md:text-4xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Revolutionizing IT Career Guidance
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-teal-600 rounded"></div>
              </div>
            </div>

            <div className="space-y-6">
              <div
                className={`text-lg leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <p className="mb-6">
                  In 2025, as{" "}
                  <span className="font-semibold text-purple-600">
                    Generative AI
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-teal-600">
                    Agentic AI
                  </span>{" "}
                  reshape traditional career paths and unlock new opportunities
                  in unstructured data and ethical AI, the technology landscape
                  demands a new approach to career development.
                </p>

                <p className="mb-6">
                  The{" "}
                  <span className="font-semibold text-purple-600">
                    skills gap is widening
                  </span>
                  , with projections indicating{" "}
                  <span className="font-bold text-teal-600">
                    19 million new jobs by 2030
                  </span>{" "}
                  but also the displacement of 9 million existing ones,
                  necessitating significant upskilling for an estimated 60% of
                  the global workforce.
                </p>
              </div>

              <div
                className={`p-6 rounded-xl border-l-4 border-purple-500 ${
                  isDark ? "bg-purple-900/20" : "bg-purple-50"
                }`}
              >
                <p
                  className={`text-lg leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Recognizing this critical need, we developed the world&apos;s
                  first{" "}
                  <span className="font-bold text-purple-600">
                    AI-driven IT Career Recommender
                  </span>
                  . Our proprietary AI moves beyond generic assessments, deeply
                  analyzing individuals&apos;{" "}
                  <span className="font-semibold text-teal-600">
                    interests, values, &amp; unique motivations
                  </span>{" "}
                  to connect them with IT roles and learning paths where their
                  passion is the driving force for unparalleled success and job
                  satisfaction.
                </p>
              </div>

              <div className="flex items-center pt-4">
                <ArrowRight className="w-5 h-5 text-teal-600 mr-3" />
                <p
                  className={`text-lg font-medium ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  We&apos;re building a future where careers are a lifelong
                  pursuit aligned with personal purpose, ensuring individuals
                  are not just ready for the future, but{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                    leading it
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Objective Section */}
        <div className="mb-24">
          <div
            className={`rounded-2xl p-8 md:p-12 border ${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            } shadow-lg`}
          >
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-500 to-purple-500 rounded-xl flex items-center justify-center mr-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  className={`text-3xl md:text-4xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Our Objective
                </h2>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600 mb-4">
                  Empowering Passion-Driven IT Careers
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-purple-600 rounded"></div>
              </div>
            </div>

            <div className="space-y-6">
              <p
                className={`text-lg leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Our objective is to empower individuals to navigate the dynamic
                2025 technology landscape by aligning their deepest passions
                with the most impactful IT career opportunities &amp; essential
                skill development.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className={`p-6 rounded-xl border-l-4 border-teal-500 ${
                    isDark ? "bg-teal-900/20" : "bg-teal-50"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-3 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Personalized Guidance
                  </h4>
                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    We aim to be the definitive platform for{" "}
                    <span className="font-semibold text-teal-600">
                      personalized IT career guidance
                    </span>
                    , leveraging advanced{" "}
                    <span className="font-semibold text-purple-600">
                      Generative AI algorithms
                    </span>{" "}
                    to recommend ideal roles and tailored learning paths.
                  </p>
                </div>

                <div
                  className={`p-6 rounded-xl border-l-4 border-purple-500 ${
                    isDark ? "bg-purple-900/20" : "bg-purple-50"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-3 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Skills &amp; Fulfillment
                  </h4>
                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    By focusing on what truly motivates individuals, we seek to
                    close the widening skills gap and cultivate a workforce that
                    is highly skilled in areas like{" "}
                    <span className="font-semibold text-purple-600">
                      AI, Big Data, &amp; cybersecurity
                    </span>{" "}
                    but also deeply fulfilled.
                  </p>
                </div>
              </div>

              <div className="flex items-center pt-4">
                <ArrowRight className="w-5 h-5 text-purple-600 mr-3" />
                <p
                  className={`text-lg font-medium ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Transforming jobs into{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600">
                    purpose-driven pursuits
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div
            className={`rounded-2xl p-8 md:p-12 border ${
              isDark
                ? "bg-gradient-to-r from-purple-900/30 to-teal-900/30 border-purple-500/30"
                : "bg-gradient-to-r from-purple-50 to-teal-50 border-purple-200/50"
            } shadow-lg`}
          >
            <h3
              className={`text-2xl md:text-3xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Ready to Discover Your IT Career Path?
            </h3>
            <p
              className={`text-lg leading-relaxed max-w-3xl mx-auto mb-8 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join thousands of professionals who have already transformed their
              careers with our AI-powered platform.
            </p>
            <button
              onClick={() => (window.location.href = "/payment")}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
