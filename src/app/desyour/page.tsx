"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  Target,
  Plus,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Linkedin,
  Award,
  Check,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/Navbar"; // Import the Navbar component

const ProfileComponent = () => {
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    currentRole: "",
    currentCompany: "",
    yearsOfExperience: "",
    industry: "",
    desiredRoles: [] as string[],
    careerGoals: "",
    skills: [] as string[],
    professionalBio: "",
    linkedinProfile: "",
    portfolioWebsite: "",
  });
  const [tempDesiredRole, setTempDesiredRole] = useState("");
  const [tempSkill, setTempSkill] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const addDesiredRole = () => {
    if (
      tempDesiredRole.trim() &&
      !formData.desiredRoles.includes(tempDesiredRole.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        desiredRoles: [...prev.desiredRoles, tempDesiredRole.trim()],
      }));
      setTempDesiredRole("");
    }
  };

  const removeDesiredRole = (roleToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      desiredRoles: prev.desiredRoles.filter((role) => role !== roleToRemove),
    }));
  };

  const addSkill = () => {
    if (tempSkill.trim() && !formData.skills.includes(tempSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, tempSkill.trim()],
      }));
      setTempSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.currentRole.trim())
      newErrors.currentRole = "Current role is required";
    if (!formData.yearsOfExperience)
      newErrors.yearsOfExperience = "Experience level is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Profile Data:", formData);
      alert("Profile created successfully!");
      // Here you would typically send to your API
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Navbar */}
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <div className="container mx-auto px-6 py-8 max-w-6xl pt-24">
        {/* Professional Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Create Your Professional Profile
          </h1>
          <p
            className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Complete your profile to unlock personalized data science learning
            paths and career opportunities
          </p>

          {/* Progress Indicator */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-green-600 w-0 transition-all duration-500"
                style={{
                  width: `${
                    (Object.keys(formData).filter(
                      (key) => formData[key as keyof typeof formData]
                    ).length /
                      Object.keys(formData).length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {Math.round(
                (Object.keys(formData).filter(
                  (key) => formData[key as keyof typeof formData]
                ).length /
                  Object.keys(formData).length) *
                  100
              )}
              % Complete
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information - Professional Card Design */}
          <div
            className={`rounded-xl border transition-all duration-300 overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200 shadow-sm hover:shadow-md"
            }`}
          >
            <div
              className={`px-6 py-4 border-b ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-emerald-100"
                  }`}
                >
                  <User
                    className={`w-5 h-5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ml-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Personal Information
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all ${
                        errors.firstName
                          ? "border-red-500 focus:ring-red-500"
                          : isDark
                          ? "border-gray-600 focus:border-emerald-500"
                          : "border-gray-300 focus:border-emerald-500"
                      } ${
                        isDark
                          ? "bg-gray-700 text-white placeholder-gray-400"
                          : "bg-white text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-500"
                        : isDark
                        ? "border-gray-600 focus:border-emerald-500"
                        : "border-gray-300 focus:border-emerald-500"
                    } ${
                      isDark
                        ? "bg-gray-700 text-white placeholder-gray-400"
                        : "bg-white text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail
                        className={`w-4 h-4 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : isDark
                          ? "border-gray-600 focus:border-emerald-500"
                          : "border-gray-300 focus:border-emerald-500"
                      } ${
                        isDark
                          ? "bg-gray-700 text-white placeholder-gray-400"
                          : "bg-white text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      placeholder="john.doe@company.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone
                        className={`w-4 h-4 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin
                        className={`w-4 h-4 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar
                        className={`w-4 h-4 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div
            className={`rounded-xl border transition-all duration-300 overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200 shadow-sm hover:shadow-md"
            }`}
          >
            <div
              className={`px-6 py-4 border-b ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-emerald-100"
                  }`}
                >
                  <Briefcase
                    className={`w-5 h-5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ml-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Professional Information
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Role *
                  </label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      errors.currentRole
                        ? "border-red-500 focus:ring-red-500"
                        : isDark
                        ? "border-gray-600 focus:border-emerald-500"
                        : "border-gray-300 focus:border-emerald-500"
                    } ${
                      isDark
                        ? "bg-gray-700 text-white placeholder-gray-400"
                        : "bg-white text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    placeholder="Data Scientist"
                  />
                  {errors.currentRole && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.currentRole}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Company
                  </label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    placeholder="Tech Corp"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Years of Experience *
                  </label>
                  <select
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      errors.yearsOfExperience
                        ? "border-red-500 focus:ring-red-500"
                        : isDark
                        ? "border-gray-600 focus:border-emerald-500"
                        : "border-gray-300 focus:border-emerald-500"
                    } ${
                      isDark
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="4-6">4-6 years</option>
                    <option value="7-10">7-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.yearsOfExperience && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.yearsOfExperience}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Career Goals & Aspirations */}
          <div
            className={`rounded-xl border transition-all duration-300 overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200 shadow-sm hover:shadow-md"
            }`}
          >
            <div
              className={`px-6 py-4 border-b ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-emerald-100"
                  }`}
                >
                  <Target
                    className={`w-5 h-5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ml-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Career Goals & Aspirations
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Desired Roles
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tempDesiredRole}
                    onChange={(e) => setTempDesiredRole(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addDesiredRole())
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    placeholder="e.g., Senior Data Scientist, ML Engineer"
                  />
                  <button
                    type="button"
                    onClick={addDesiredRole}
                    className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.desiredRoles.map((role, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm ${
                        isDark
                          ? "bg-emerald-900/30 text-emerald-400 border border-emerald-700"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => removeDesiredRole(role)}
                        className={`ml-2 ${
                          isDark
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-emerald-600 hover:text-emerald-800"
                        }`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Career Goals
                </label>
                <textarea
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  placeholder="Describe your short-term and long-term career aspirations..."
                />
              </div>
            </div>
          </div>

          {/* Skills & Biography */}
          <div
            className={`rounded-xl border transition-all duration-300 overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200 shadow-sm hover:shadow-md"
            }`}
          >
            <div
              className={`px-6 py-4 border-b ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-emerald-100"
                  }`}
                >
                  <Award
                    className={`w-5 h-5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ml-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Skills & Expertise
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Technical Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tempSkill}
                    onChange={(e) => setTempSkill(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    placeholder="e.g., Python, Machine Learning, SQL"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm ${
                        isDark
                          ? "bg-emerald-900/30 text-emerald-400 border border-emerald-700"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className={`ml-2 ${
                          isDark
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-emerald-600 hover:text-emerald-800"
                        }`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Professional Summary
                </label>
                <textarea
                  name="professionalBio"
                  value={formData.professionalBio}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  placeholder="Provide a brief professional summary highlighting your experience, achievements, and what makes you unique..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Linkedin
                        className={`w-4 h-4 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Portfolio/Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe
                        className={`w-4 h-4 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="url"
                      name="portfolioWebsite"
                      value={formData.portfolioWebsite}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      placeholder="yourportfolio.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div
            className={`rounded-xl p-6 text-center ${
              isDark ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <button
              type="submit"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Check className="w-5 h-5 mr-2" />
              Complete Profile
            </button>
            <p
              className={`text-sm mt-3 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              By completing your profile, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileComponent;
