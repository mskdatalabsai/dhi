"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  Target,
  GraduationCap,
  Clock,
  Building,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";

const ProfileComponent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    age_group: "",
    education: "",
    experience: "",
    purpose: "",
    functional_area: "",
    roles: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }

    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated") {
      loadProfile();
    }
  }, [status, router]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/profiles");
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (data.profile) {
        setFormData({
          age_group: data.profile.age_group || "",
          education: data.profile.education || "",
          experience: data.profile.experience || "",
          purpose: data.profile.purpose || "",
          functional_area: data.profile.functional_area || "",
          roles: data.profile.roles || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const formOptions = {
    age_group: [
      "18–23 (Pre-graduate/Undergraduate)",
      "23–25 (Graduate/Postgraduate exploring tech)",
      "25–30 (Non-IT background, wants to switch to IT)",
      "25–30 (Already in IT, wants to switch tech domain)",
      "30+ (Experienced professional, wants to enter IT)",
    ],
    education: [
      "Undergraduate (in progress)",
      "Graduate",
      "Postgraduate",
      "Other (Diploma, Certification, etc.)",
    ],
    experience: ["Fresher (0 years)", "1–5 years", "5–10 years", "10+ years"],
    purpose: [
      "I'm a student exploring IT career options",
      "I'm from a non-IT background and want to switch",
      "I'm already in IT and want to switch domain",
      "I want to assess myself before investing in upskilling",
      "I'm already experienced in IT and want role validation",
    ],
    functional_area: [
      "Engineering and Development",
      "Product Management",
      "Quality Assurance and Testing",
      "Design and User Experience (UX/UI)",
      "Data and Analytics",
      "IT and Infrastructure",
      "Cybersecurity",
      "Business-Facing Tech Roles",
    ],
    roles: [
      "Software Engineer / Developer",
      "Mobile Developer (iOS/Android)",
      "DevOps Engineer",
      "MLOps Engineer",
      "Software Architect",
      "Business Analyst",
      "Product Manager",
      "Technical Product Manager",
      "Product Owner",
      "QA Engineer / Software Tester",
      "Automation Engineer",
      "UX Designer (User Experience)",
      "UI Designer (User Interface)",
      "Data Scientist",
      "AI/ML Engineer",
      "Data Engineer",
      "Business Intelligence Expert",
      "Data Analyst",
      "Systems Administrator",
      "Network Engineer",
      "Cloud Engineer",
      "Database Administrator (SQL/NoSQL DBA)",
      "Pre-Sales Engineer / Solutions Consultant",
      "IT Sales / Technical Business Development",
      "Cybersecurity Analyst",
      "Security Engineer",
      "SOC Analyst (Security Operations Center)",
      "Ethical Hacker / Penetration Tester",
      "Information Security Specialist",
    ],
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.age_group) newErrors.age_group = "Age group is required";
    if (!formData.education)
      newErrors.education = "Education level is required";
    if (!formData.experience)
      newErrors.experience = "Experience level is required";
    if (!formData.purpose) newErrors.purpose = "Purpose is required";
    if (!formData.functional_area)
      newErrors.functional_area = "Functional area is required";
    if (!formData.roles) newErrors.roles = "Role selection is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const response = await fetch("/api/admin/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        alert("Profile saved successfully!");
        router.push("/survey");
      } else {
        alert(data.error || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getCompletionPercentage = () => {
    const filledFields = Object.values(formData).filter(
      (value) => value !== ""
    ).length;
    return Math.round((filledFields / Object.keys(formData).length) * 100);
  };

  const renderSelectField = (
    name: keyof typeof formData,
    label: string,
    icon: React.ReactNode,
    options: string[],
    required: boolean = true
  ) => (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label} {required && "*"}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <select
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
            errors[name]
              ? "border-red-500 focus:ring-red-500"
              : isDark
              ? "border-gray-600 focus:border-purple-500"
              : "border-gray-300 focus:border-purple-500"
          } ${
            isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  if (status === "loading" || isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Navbar */}
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <div className="container mx-auto px-6 py-8 max-w-4xl pt-24">
        {/* Professional Header */}
        <div className="mb-8">
          <h2
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Discover Your Perfect IT Career Path
          </h2>
          <p
            className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Answer a few questions to get personalized career recommendations
            tailored to your background and goals
          </p>

          {/* User Info */}
          {session?.user && (
            <p
              className={`text-sm mt-2 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Logged in as: {session.user.email}
            </p>
          )}

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center space-x-4">
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-teal-600 transition-all duration-500"
                style={{
                  width: `${getCompletionPercentage()}%`,
                }}
              ></div>
            </div>
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {getCompletionPercentage()}% Complete
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Demographics Section */}
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
                    isDark ? "bg-gray-700" : "bg-purple-100"
                  }`}
                >
                  <User
                    className={`w-5 h-5 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ml-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  About You
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {renderSelectField(
                  "age_group",
                  "Age Group",
                  <User
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />,
                  formOptions.age_group
                )}

                {renderSelectField(
                  "education",
                  "Education Level",
                  <GraduationCap
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />,
                  formOptions.education
                )}
              </div>
            </div>
          </div>

          {/* Experience & Purpose Section */}
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
                    isDark ? "bg-gray-700" : "bg-teal-100"
                  }`}
                >
                  <Clock
                    className={`w-5 h-5 ${
                      isDark ? "text-teal-400" : "text-teal-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ml-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Experience & Goals
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {renderSelectField(
                  "experience",
                  "Experience Level",
                  <Briefcase
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />,
                  formOptions.experience
                )}

                {renderSelectField(
                  "purpose",
                  "Purpose",
                  <Target
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />,
                  formOptions.purpose
                )}
              </div>
            </div>
          </div>

          {/* Career Preferences Section */}
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
                    isDark ? "bg-gray-700" : "bg-purple-100"
                  }`}
                >
                  <Building
                    className={`w-5 h-5 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ml-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Career Preferences
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {renderSelectField(
                  "functional_area",
                  "Functional Area of Interest",
                  <Target
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />,
                  formOptions.functional_area
                )}

                {renderSelectField(
                  "roles",
                  "Specific Role Interest",
                  <Briefcase
                    className={`w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />,
                  formOptions.roles
                )}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div
            className={`rounded-xl p-8 text-center ${
              isDark ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Save Profile & Start Assessment
                </>
              )}
            </button>
            <p
              className={`text-sm mt-4 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Your profile will be saved and you&apos;ll be redirected to the
              assessment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
