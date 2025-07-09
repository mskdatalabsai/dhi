import React from "react";
import { AlertCircle } from "lucide-react";

const SelectField = ({
  name,
  label,
  icon,
  options,
  required,
  value,
  error,
  onChange,
  isDark,
}: {
  name: string;
  label: string;
  icon: React.ReactNode;
  options: string[];
  required?: boolean;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isDark: boolean;
}) => (
  <div>
    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
      {label} {required && "*"}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
          error ? "border-red-500 focus:ring-red-500" : isDark ? "border-gray-600 focus:border-purple-500" : "border-gray-300 focus:border-purple-500"
        } ${isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center">
        <AlertCircle className="w-3 h-3 mr-1" />
        {error}
      </p>
    )}
  </div>
);

export default SelectField;