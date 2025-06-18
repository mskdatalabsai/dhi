"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  User,
  Briefcase,
  Target,
  FileText,
  Save,
  X,
  ChevronRight,
} from "lucide-react";

const DescribeYourselfPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [profileData, setProfileData] = useState<ProfileData>({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: "",

    // Professional Information
    currentRole: "",
    currentCompany: "",
    experience: "",
    industry: "",

    // Career Goals
    wantedRoles: [],
    preferredIndustries: [],
    careerGoals: "",

    // Skills & Bio
    skills: [],
    bio: "",
    linkedin: "",
    portfolio: "",

    // Additional
    availability: "",
    salaryRange: "",
    workPreference: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

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

  interface ProfileData {
    [key: string]: string | string[];
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    dateOfBirth: string;
    currentRole: string;
    currentCompany: string;
    experience: string;
    industry: string;
    wantedRoles: string[];
    preferredIndustries: string[];
    careerGoals: string;
    skills: string[];
    bio: string;
    linkedin: string;
    portfolio: string;
    availability: string;
    salaryRange: string;
    workPreference: string;
  }

  interface ValidationErrors {
    [key: string]: boolean | string | undefined;
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean | string;
    currentRole?: boolean;
    experience?: boolean;
    wantedRoles?: string;
  }

  const handleInputChange = (field: keyof ProfileData, value: unknown) => {
    setProfileData((prev: ProfileData) => ({
      ...prev,
      [field]: value as string | string[],
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev: ValidationErrors) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      handleInputChange("skills", [...profileData.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  interface RemoveSkillFn {
    (skillToRemove: string): void;
  }

  const removeSkill: RemoveSkillFn = (skillToRemove) => {
    handleInputChange(
      "skills",
      profileData.skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const addWantedRole = () => {
    if (
      roleInput.trim() &&
      !profileData.wantedRoles.includes(roleInput.trim())
    ) {
      handleInputChange("wantedRoles", [
        ...profileData.wantedRoles,
        roleInput.trim(),
      ]);
      setRoleInput("");
    }
  };

  interface RemoveWantedRoleFn {
    (roleToRemove: string): void;
  }

  const removeWantedRole: RemoveWantedRoleFn = (roleToRemove) => {
    handleInputChange(
      "wantedRoles",
      profileData.wantedRoles.filter((role) => role !== roleToRemove)
    );
  };

  const validateForm = () => {
    const errors: Record<string, boolean | string> = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "currentRole",
      "experience",
    ];

    requiredFields.forEach((field) => {
      if (
        !profileData[field] ||
        (typeof profileData[field] === "string" &&
          profileData[field].trim() === "")
      ) {
        errors[field] = true;
      }
    });

    if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = "Invalid email format";
    }

    if (profileData.wantedRoles.length === 0) {
      errors.wantedRoles = "Please add at least one desired role";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submissionData = {
        ...profileData,
        timestamp: new Date().toISOString(),
        userId: "user_" + Date.now(), // You'd get this from auth
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Profile submitted:", submissionData);

      // In a real app, you would submit to your database:
      // const response = await fetch('/api/submit-profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submissionData)
      // });

      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Error submitting profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`max-w-md w-full mx-4 p-8 rounded-2xl ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } shadow-xl text-center`}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Profile Created!</h2>
          <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Your profile has been successfully created. You can now explore
            personalized opportunities.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Tell Us About Yourself
          </h1>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Help us create your professional profile and find the perfect
            opportunities
          </p>
        </div>

        <div className="space-y-8">
          {/* Personal Information Section */}
          <div
            className={`rounded-2xl p-8 shadow-xl border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Personal Information
              </h2>
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
                  value={profileData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.firstName
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                  } ${
                    isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                  }`}
                  placeholder="Enter your first name"
                />
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
                  value={profileData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.lastName
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                  } ${
                    isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                  }`}
                  placeholder="Enter your last name"
                />
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
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.email
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                  } ${
                    isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                  }`}
                  placeholder="your.email@company.com"
                />
                {validationErrors.email &&
                  typeof validationErrors.email === "string" && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.email}
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
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
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
                  value={profileData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
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
                  value={profileData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div
            className={`rounded-2xl p-8 shadow-xl border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h2
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Professional Information
              </h2>
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
                  value={profileData.currentRole}
                  onChange={(e) =>
                    handleInputChange("currentRole", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.currentRole
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                  } ${
                    isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                  }`}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                />
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
                  value={profileData.currentCompany}
                  onChange={(e) =>
                    handleInputChange("currentCompany", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
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
                  value={profileData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.experience
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                  } ${
                    isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years (Entry Level)</option>
                  <option value="2-3">2-3 years (Junior)</option>
                  <option value="4-6">4-6 years (Mid-level)</option>
                  <option value="7-10">7-10 years (Senior)</option>
                  <option value="10+">10+ years (Expert/Lead)</option>
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
                  value={profileData.industry}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Career Goals Section */}
          <div
            className={`rounded-2xl p-8 shadow-xl border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Career Goals & Aspirations
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Desired Roles *
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addWantedRole()}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                    placeholder="e.g., Senior Developer, Product Manager"
                  />
                  <button
                    onClick={addWantedRole}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.wantedRoles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {role}
                      <button
                        onClick={() => removeWantedRole(role)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                {validationErrors.wantedRoles && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.wantedRoles}
                  </p>
                )}
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
                  value={profileData.careerGoals}
                  onChange={(e) =>
                    handleInputChange("careerGoals", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                  rows={4}
                  placeholder="Describe your career aspirations and goals..."
                />
              </div>
            </div>
          </div>

          {/* Skills & Bio Section */}
          <div
            className={`rounded-2xl p-8 shadow-xl border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Skills & Biography
              </h2>
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
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                    placeholder="e.g., JavaScript, Project Management, Design"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-green-600 hover:text-green-800"
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
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                  rows={4}
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
                    value={profileData.linkedin}
                    onChange={(e) =>
                      handleInputChange("linkedin", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
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
                    value={profileData.portfolio}
                    onChange={(e) =>
                      handleInputChange("portfolio", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating Profile...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-3" />
                  Create My Profile
                  <ChevronRight className="w-5 h-5 ml-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescribeYourselfPage;
