"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LandHero from "./components/Hero";
import Stats from "./components/Stats";
import WhyChoose from "./components/WhyChoose";
import HowItWorks from "./components/HowItWorks";
import SuccessStories from "./components/SuccessStories";
import TrustedBy from "./components/TrustedBy";
import FAQ from "./components/FAQ";
import CTAForm from "./components/CTAForm";

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
          <LandHero isDark={isDark} />
          <Stats isDark={isDark} />
          <WhyChoose isDark={isDark} />
          <HowItWorks isDark={isDark} />
          <SuccessStories isDark={isDark} />
          <TrustedBy isDark={isDark} />
          <FAQ isDark={isDark} />
          <CTAForm
            isDark={isDark}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
