"use client";
import { Check } from "lucide-react";

const benefits = [
  {
    title: "Comprehensive AI Assessment",
    desc: "Advanced algorithms analyze your skills, experience, and career goals",
  },
  {
    title: "Personalized Career Roadmap",
    desc: "Get a customized learning path tailored to your target role",
  },
  {
    title: "Industry Insights",
    desc: "Receive recommendations based on current market trends and demands",
  },
];

const BenefitsCard = ({ isDark }: { isDark: boolean }) => (
  <div className={`rounded-2xl p-8 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
    <h3 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
      What You&apos;ll Get
    </h3>
    <div className="space-y-4">
      {benefits.map((benefit, idx) => (
        <div key={idx} className="flex items-start space-x-3">
          <Check className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
              {benefit.title}
            </h4>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {benefit.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BenefitsCard;
