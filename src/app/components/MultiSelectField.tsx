// components/MultiSelectField.tsx

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface MultiSelectFieldProps {
  name: string;
  label: string;
  icon?: React.ReactNode;
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  isDark: boolean;
  placeholder?: string;
  maxSelections?: number;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  name,
  label,
  icon,
  options,
  value = [],
  onChange,
  error,
  isDark,
  placeholder = "Select options...",
  maxSelections,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, option]);
      }
    }
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((item) => item !== option));
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-2 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </label>

      <div
        className={`relative cursor-pointer ${
          error ? "ring-2 ring-red-500" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`
          min-h-[42px] w-full px-3 py-2 rounded-lg border transition-all duration-200
          ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
              : "bg-white border-gray-300 text-gray-900 hover:border-gray-400"
          }
          ${isOpen ? "ring-2 ring-purple-500 border-transparent" : ""}
        `}
        >
          <div className="flex items-center flex-wrap gap-2 pr-8">
            {icon && (
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                {icon}
              </span>
            )}

            {value.length === 0 ? (
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                {placeholder}
              </span>
            ) : (
              value.map((item, index) => (
                <span
                  key={index}
                  className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm
                    ${
                      isDark
                        ? "bg-purple-900/50 text-purple-300 border border-purple-700"
                        : "bg-purple-100 text-purple-800 border border-purple-300"
                    }
                  `}
                >
                  {item}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={(e) => removeOption(item, e)}
                  />
                </span>
              ))
            )}
          </div>

          <ChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform
              ${isDark ? "text-gray-400" : "text-gray-500"}
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
          absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden
          ${
            isDark
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-200"
          }
        `}
        >
          {/* Search input */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full px-3 py-1.5 rounded-md text-sm
                ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }
                border focus:outline-none focus:ring-2 focus:ring-purple-500
              `}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div
                className={`px-4 py-3 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = value.includes(option);
                const isDisabled =
                  !isSelected && maxSelections && value.length >= maxSelections;

                return (
                  <div
                    key={index}
                    className={`
                      px-4 py-2.5 cursor-pointer transition-colors
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                      ${
                        isSelected
                          ? isDark
                            ? "bg-purple-900/30 text-purple-300"
                            : "bg-purple-50 text-purple-700"
                          : isDark
                          ? "hover:bg-gray-600 text-gray-300"
                          : "hover:bg-gray-50 text-gray-700"
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) {
                        toggleOption(option);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{option}</span>
                      {isSelected && <span className="text-xs">✓</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {maxSelections && (
            <div
              className={`
              px-4 py-2 text-xs border-t
              ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-gray-400"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }
            `}
            >
              {value.length} / {maxSelections} selected
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default MultiSelectField;
