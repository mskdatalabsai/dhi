"use client";
import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  Rocket,
  ArrowRight,
  User,
  Building2,
  GraduationCap,
  Compass,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const AboutUsPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const differentiators = [
    {
      icon: Brain,
      title: "Science + AI Fusion",
      description:
        "We combine validated psychometric methods with advanced AI algorithms.",
      color: "purple",
    },
    {
      icon: User,
      title: "Personalized Insights",
      description:
        "Every recommendation is tailored to your strengths, passions, and market trends.",
      color: "teal",
    },
    {
      icon: Rocket,
      title: "Future-Proof Careers",
      description:
        "We align you with IT roles that aren't just relevant today, but will lead tomorrow.",
      color: "purple",
    },
    {
      icon: GraduationCap,
      title: "Mentorship & Growth",
      description:
        "Beyond assessments, we connect you with mentors, roadmaps, and learning paths to help you thrive.",
      color: "teal",
    },
  ];

  const experienceLogos = [
    { name: "GE", icon: Building2 },
    { name: "Oracle", icon: Building2 },
    { name: "TCS", icon: Building2 },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Navbar
        isDark={false}
        toggleTheme={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      {/* Main Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-teal-600/10"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1
                className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                  DHITI.AI
                </span>
              </h1>
              <p
                className={`text-xl md:text-2xl leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Discover Heuristic Insights Through Intelligence
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div
              className={`rounded-3xl p-8 md:p-12 ${
                isDark
                  ? "bg-gradient-to-br from-gray-800 to-gray-850"
                  : "bg-white"
              } shadow-2xl border ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2
                  className={`text-3xl md:text-4xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Who We Are
                </h2>
              </div>

              <p
                className={`text-lg md:text-xl leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                At{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                  Dhiti.AI
                </span>
                , we believe careers should be shaped by{" "}
                <span className="font-semibold text-purple-600">passion</span>,{" "}
                <span className="font-semibold text-teal-600">potential</span>,
                and{" "}
                <span className="font-semibold text-purple-600">precision</span>
                , not just by chance. Our mission is to help individuals,
                students, and career switchers discover the{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                  IT role they were truly meant to do
                </span>
                , using the power of{" "}
                <span className="font-semibold">
                  AI-driven assessments and personalized insights
                </span>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Founder's Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div
              className={`rounded-3xl overflow-hidden ${
                isDark
                  ? "bg-gradient-to-br from-purple-900/30 to-teal-900/30"
                  : "bg-gradient-to-br from-purple-50 to-teal-50"
              } shadow-2xl border ${
                isDark ? "border-purple-500/30" : "border-purple-200/50"
              }`}
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-teal-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <h2
                    className={`text-3xl md:text-4xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Our Founder's Story
                  </h2>
                </div>

                <div className="space-y-6">
                  <p
                    className={`text-lg leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Dhiti.AI was founded by a{" "}
                    <span className="font-bold text-purple-600">
                      data scientist with over 15 years of experience
                    </span>{" "}
                    in Artificial Intelligence and Data Science, working with
                    global leaders like:
                  </p>

                  {/* Company Logos */}
                  <div className="flex flex-wrap gap-6 my-8">
                    {experienceLogos.map((company, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                          isDark ? "bg-gray-800/50" : "bg-white"
                        } shadow-md`}
                      >
                        <company.icon className="w-5 h-5 text-purple-600" />
                        <span
                          className={`font-bold text-lg ${
                            isDark ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {company.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p
                    className={`text-lg leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Having spent years at the intersection of{" "}
                    <span className="font-semibold text-teal-600">
                      cutting-edge AI research
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-purple-600">
                      real-world enterprise solutions
                    </span>
                    , he has seen firsthand how technology transforms industries
                    and how individuals often struggle to find their{" "}
                    <span className="font-bold">right place within it</span>.
                  </p>

                  <p
                    className={`text-lg leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Beyond corporate experience, he is deeply passionate about{" "}
                    <span className="font-semibold text-teal-600">
                      training and mentoring the next generation
                    </span>{" "}
                    of AI and data science professionals. This passion led to
                    the creation of <span className="font-bold">Dhiti.AI</span>,
                    a platform that combines{" "}
                    <span className="font-semibold text-purple-600">
                      psychometric science
                    </span>
                    ,{" "}
                    <span className="font-semibold text-teal-600">
                      heuristic insights
                    </span>
                    , and{" "}
                    <span className="font-semibold text-purple-600">
                      machine learning
                    </span>{" "}
                    to make career discovery{" "}
                    <span className="font-bold">
                      smarter, faster, and more accurate
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div
              className={`rounded-3xl p-8 md:p-12 ${
                isDark
                  ? "bg-gradient-to-br from-gray-800 to-gray-850"
                  : "bg-white"
              } shadow-2xl border ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                  <Compass className="w-7 h-7 text-white" />
                </div>
                <h2
                  className={`text-3xl md:text-4xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Our Vision
                </h2>
              </div>

              <p
                className={`text-lg md:text-xl leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                To become the{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                  go-to AI-powered career compass
                </span>{" "}
                for anyone exploring or advancing in IT, helping millions make{" "}
                <span className="font-semibold text-purple-600">confident</span>
                ,{" "}
                <span className="font-semibold text-teal-600">
                  informed decisions
                </span>{" "}
                about their future.
              </p>
            </div>
          </div>
        </section>

        {/* What Makes Dhiti Different Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                What Makes{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                  Dhiti Different?
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {differentiators.map((item, index) => (
                <div
                  key={index}
                  className={`group relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                    isDark ? "bg-gray-800" : "bg-white"
                  } shadow-xl hover:shadow-2xl border ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      item.color === "purple"
                        ? "from-purple-600/10 to-transparent"
                        : "from-teal-600/10 to-transparent"
                    } rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  ></div>

                  <div className="relative">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${
                        item.color === "purple"
                          ? "from-purple-600 to-purple-500"
                          : "from-teal-600 to-teal-500"
                      } rounded-xl flex items-center justify-center mb-4`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>

                    <h3
                      className={`text-xl font-bold mb-3 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`leading-relaxed ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Message */}
            <div
              className={`mt-12 text-center p-8 rounded-2xl ${
                isDark
                  ? "bg-gradient-to-r from-purple-900/30 to-teal-900/30"
                  : "bg-gradient-to-r from-purple-50 to-teal-50"
              } border ${
                isDark ? "border-purple-500/30" : "border-purple-200/50"
              }`}
            >
              <p
                className={`text-lg md:text-xl leading-relaxed ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                <em>
                  At Dhiti.AI, we're not just predicting your career. We're{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                    unlocking your potential
                  </span>
                  , so you can{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600">
                    lead the future of work
                  </span>
                  .
                </em>
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div
              className={`text-center rounded-3xl p-12 ${
                isDark
                  ? "bg-gradient-to-r from-purple-900/40 via-teal-900/40 to-purple-900/40"
                  : "bg-gradient-to-r from-purple-100 via-teal-100 to-purple-100"
              } shadow-2xl`}
            >
              <h3
                className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Ready to Discover Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                  IT Career Path?
                </span>
              </h3>
              <p
                className={`text-lg md:text-xl mb-8 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Join thousands of professionals who have already transformed
                their careers with our AI-powered platform.
              </p>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl">
                Start Your Assessment
                <ArrowRight className="ml-3 w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
