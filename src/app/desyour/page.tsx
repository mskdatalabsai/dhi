"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  User,
  Briefcase,
  Target,
  BookOpen,
  Plus,
  X,
} from "lucide-react";

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
        isDark
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
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

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
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
                    id="greenToYellowProfile"
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
                  stroke="url(#greenToYellowProfile)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <path
                  d="M40 45 L50 30"
                  stroke="url(#greenToYellowProfile)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
              </svg>
            </div>
            <h1
              className={`text-3xl font-bold mb-2 ${
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
            Tell Us About Yourself
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Help us create your professional profile and find the perfect
            opportunities
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div
            className={`rounded-2xl p-8 border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white shadow-lg border-gray-200"
            }`}
          >
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-emerald-600 mr-3" />
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Personal Information
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    errors.firstName
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                  } ${
                    isDark
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-50 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
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
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    errors.lastName
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                  } ${
                    isDark
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-50 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
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
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    errors.email
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                  } ${
                    isDark
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-50 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="your.email@company.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="City, State/Country"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div
            className={`rounded-2xl p-8 border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white shadow-lg border-gray-200"
            }`}
          >
            <div className="flex items-center mb-6">
              <Briefcase className="w-6 h-6 text-emerald-600 mr-3" />
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Professional Information
              </h3>
            </div>

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
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    errors.currentRole
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                  } ${
                    isDark
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-50 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                />
                {errors.currentRole && (
                  <p className="text-red-500 text-sm mt-1">
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
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Company name"
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
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-3">2-3 years</option>
                  <option value="4-6">4-6 years</option>
                  <option value="7-10">7-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
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
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
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

          {/* Career Goals & Aspirations */}
          <div
            className={`rounded-2xl p-8 border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white shadow-lg border-gray-200"
            }`}
          >
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 text-emerald-600 mr-3" />
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Career Goals & Aspirations
              </h3>
            </div>

            <div className="space-y-6">
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
                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="e.g., Senior Developer, Product Manager"
                  />
                  <button
                    type="button"
                    onClick={addDesiredRole}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.desiredRoles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => removeDesiredRole(role)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="w-4 h-4" />
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
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Describe your career aspirations and goals..."
                />
              </div>
            </div>
          </div>

          {/* Skills & Biography */}
          <div
            className={`rounded-2xl p-8 border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white shadow-lg border-gray-200"
            }`}
          >
            <div className="flex items-center mb-6">
              <BookOpen className="w-6 h-6 text-emerald-600 mr-3" />
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Skills & Biography
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tempSkill}
                    onChange={(e) => setTempSkill(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="e.g., JavaScript, Project Management, Design"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="w-4 h-4" />
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
                  Professional Bio
                </label>
                <textarea
                  name="professionalBio"
                  value={formData.professionalBio}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Tell us about yourself, your experience, and what makes you unique..."
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
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Portfolio/Website
                  </label>
                  <input
                    type="url"
                    name="portfolioWebsite"
                    value={formData.portfolioWebsite}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              🚀 Create My Profile
            </button>
            <p
              className={`text-sm mt-4 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Your information is secure and will only be used to match you with
              relevant opportunities
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileComponent;
