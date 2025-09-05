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
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

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

  // Fixed heights for different sections
  const SEARCH_HEIGHT = 52;
  const COUNTER_HEIGHT = maxSelections ? 41 : 0;
  const DROPDOWN_MAX_HEIGHT = 250; // Total max height
  const OPTIONS_MAX_HEIGHT =
    DROPDOWN_MAX_HEIGHT - SEARCH_HEIGHT - COUNTER_HEIGHT;

  return (
    <div className="relative" ref={containerRef}>
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

      {/* Dropdown with absolute fixed height */}
      {isOpen && (
        <div
          className={`
            absolute left-0 right-0 z-[999999] mt-1 rounded-lg shadow-2xl overflow-hidden
            ${
              isDark
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-200"
            }
          `}
          style={{
            height: `${DROPDOWN_MAX_HEIGHT}px`,
            maxHeight: `${DROPDOWN_MAX_HEIGHT}px`,
          }}
        >
          {/* Container with exact height */}
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Search input - Fixed height */}
            <div
              style={{
                height: `${SEARCH_HEIGHT}px`,
                padding: "8px",
                flexShrink: 0,
              }}
              className={isDark ? "bg-gray-700" : "bg-white"}
            >
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                style={{ height: "36px" }}
                className={`
                  w-full px-3 rounded-md text-sm
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

            {/* Options list - Fixed height with scroll */}
            <div
              style={{
                height: `${OPTIONS_MAX_HEIGHT}px`,
                maxHeight: `${OPTIONS_MAX_HEIGHT}px`,
                overflowY: "scroll", // Always show scrollbar
                overflowX: "hidden",
                borderTop: "1px solid",
                borderBottom: maxSelections ? "1px solid" : "none",
              }}
              className={isDark ? "border-gray-600" : "border-gray-200"}
            >
              {filteredOptions.length === 0 ? (
                <div
                  className={`h-full flex items-center justify-center text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No options found
                </div>
              ) : (
                <div>
                  {filteredOptions.map((option, index) => {
                    const isSelected = value.includes(option);
                    const isDisabled =
                      !isSelected &&
                      maxSelections &&
                      value.length >= maxSelections;

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
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-purple-500 flex-shrink-0 ml-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selection counter - Fixed height */}
            {maxSelections && (
              <div
                style={{
                  height: `${COUNTER_HEIGHT}px`,
                  padding: "8px 16px",
                  flexShrink: 0,
                }}
                className={`
                  ${
                    isDark
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-50 text-gray-600"
                  }
                `}
              >
                <div className="flex items-center justify-between text-xs font-medium">
                  <span>
                    Selected: {value.length} / {maxSelections}
                  </span>
                  {value.length === maxSelections && (
                    <span className="text-amber-500">Max reached</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default MultiSelectField;
