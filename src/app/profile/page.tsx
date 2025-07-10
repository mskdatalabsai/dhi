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
} from "lucide-react";

import Navbar from "../components/Navbar";
import ProfileHeader from "../components/ProfileHeader";
import SelectField from "../components/SelectField";
import SubmitSection from "../components/SubmitSection";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasPayment, setHasPayment] = useState(false);
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
    if (savedTheme) setIsDark(savedTheme === "dark");

    // Check authentication first
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      // Check payment status before loading profile
      checkPaymentAndLoadProfile();
    }
  }, [status, router]);

  const checkPaymentAndLoadProfile = async () => {
    try {
      setIsLoading(true);

      // First check if user has paid
      const paymentResponse = await fetch("/api/payment/status");
      const paymentData = await paymentResponse.json();

      if (!paymentData.hasPaid) {
        // User hasn't paid, redirect to payment page
        alert(
          "Please complete your payment first to access the profile setup."
        );
        router.push("/payment");
        return;
      }

      setHasPayment(true);

      // If payment is confirmed, load profile
      await loadProfile();
    } catch (error) {
      console.error("Error checking payment status:", error);
      // On error, redirect to payment to be safe
      router.push("/payment");
    }
  };

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/profile");
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Show loading screen while checking authentication and payment
  if (status === "loading" || isLoading || !hasPayment) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <svg
            className="animate-spin w-12 h-12 mx-auto mb-4 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            {status === "loading"
              ? "Loading..."
              : "Verifying payment status..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if unauthenticated (will redirect)
  if (status === "unauthenticated") return null;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <div className="container mx-auto px-6 py-8 max-w-4xl pt-24">
        <ProfileHeader
          isDark={isDark}
          session={session}
          completion={getCompletionPercentage()}
        />

        <div className="space-y-6">
          {/* About You */}
          <Section
            title="About You"
            icon={<User className="w-5 h-5" />}
            isDark={isDark}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <SelectField
                name="age_group"
                label="Age Group"
                icon={<User className="w-4 h-4" />}
                options={formOptions.age_group}
                value={formData.age_group}
                onChange={handleInputChange}
                error={errors.age_group}
                isDark={isDark}
              />
              <SelectField
                name="education"
                label="Education Level"
                icon={<GraduationCap className="w-4 h-4" />}
                options={formOptions.education}
                value={formData.education}
                onChange={handleInputChange}
                error={errors.education}
                isDark={isDark}
              />
            </div>
          </Section>

          {/* Experience & Goals */}
          <Section
            title="Experience & Goals"
            icon={<Clock className="w-5 h-5" />}
            isDark={isDark}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <SelectField
                name="experience"
                label="Experience Level"
                icon={<Briefcase className="w-4 h-4" />}
                options={formOptions.experience}
                value={formData.experience}
                onChange={handleInputChange}
                error={errors.experience}
                isDark={isDark}
              />
              <SelectField
                name="purpose"
                label="Purpose"
                icon={<Target className="w-4 h-4" />}
                options={formOptions.purpose}
                value={formData.purpose}
                onChange={handleInputChange}
                error={errors.purpose}
                isDark={isDark}
              />
            </div>
          </Section>

          {/* Career Preferences */}
          <Section
            title="Career Preferences"
            icon={<Building className="w-5 h-5" />}
            isDark={isDark}
          >
            <div className="space-y-6">
              <SelectField
                name="functional_area"
                label="Functional Area of Interest"
                icon={<Target className="w-4 h-4" />}
                options={formOptions.functional_area}
                value={formData.functional_area}
                onChange={handleInputChange}
                error={errors.functional_area}
                isDark={isDark}
              />
              <SelectField
                name="roles"
                label="Specific Role Interest"
                icon={<Briefcase className="w-4 h-4" />}
                options={formOptions.roles}
                value={formData.roles}
                onChange={handleInputChange}
                error={errors.roles}
                isDark={isDark}
              />
            </div>
          </Section>

          <SubmitSection
            isDark={isDark}
            isSaving={isSaving}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

const Section = ({
  title,
  icon,
  children,
  isDark,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isDark: boolean;
}) => (
  <div
    className={`rounded-xl border transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200 shadow-sm hover:shadow-md"
    }`}
  >
    <div
      className={`px-6 py-4 border-b ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center">
        <div
          className={`p-2 rounded-lg ${
            isDark ? "bg-gray-700" : "bg-purple-100"
          }`}
        >
          {icon}
        </div>
        <h3
          className={`text-xl font-semibold ml-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default ProfilePage;
