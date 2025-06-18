"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  User,
  BookOpen,
  Target,
  Phone,
  Home,
} from "lucide-react";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const navigationLinks = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: "About Us",
      href: "/about",
      icon: <User className="w-4 h-4" />,
    },
    {
      name: "Courses",
      href: "#",
      icon: <BookOpen className="w-4 h-4" />,
      dropdown: [
        { name: "Data Science Foundations", href: "/courses/foundations" },
        { name: "Complete Bootcamp", href: "/courses/bootcamp" },
        { name: "AI & ML Mastery", href: "/courses/mastery" },
        { name: "Corporate Training", href: "/courses/corporate" },
      ],
    },
    {
      name: "Assessment",
      href: "/survey",
      icon: <Target className="w-4 h-4" />,
    },
    {
      name: "Contact",
      href: "/contact",
      icon: <Phone className="w-4 h-4" />,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `backdrop-blur-md border-b ${
              isDark
                ? "bg-gray-900/90 border-gray-700"
                : "bg-white/90 border-gray-200"
            }`
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden">
              <svg
                width="48"
                height="48"
                viewBox="0 0 80 80"
                className="absolute inset-0"
              >
                <defs>
                  <linearGradient
                    id="navLogo"
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
                  stroke="url(#navLogo)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <path
                  d="M40 45 L50 30"
                  stroke="url(#navLogo)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                MSK DATALABS.AI
              </h1>
              <p className="text-xs text-gray-500 italic">
                acquire indefinitely...
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link, index) => (
              <div key={index} className="relative group">
                {link.dropdown ? (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsCoursesDropdownOpen(!isCoursesDropdownOpen)
                      }
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {isCoursesDropdownOpen && (
                      <div
                        className={`absolute top-full left-0 mt-2 w-56 rounded-xl shadow-xl border transition-all duration-200 ${
                          isDark
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="py-2">
                          {link.dropdown.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.href}
                              className={`block px-4 py-3 text-sm transition-colors ${
                                isDark
                                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={link.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isDark
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* CTA Button */}
            <div className="hidden md:block">
              <a
                href="/payment"
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`lg:hidden border-t transition-all duration-300 ${
              isDark
                ? "bg-gray-900/95 border-gray-700"
                : "bg-white/95 border-gray-200"
            }`}
          >
            <div className="py-4 space-y-2">
              {navigationLinks.map((link, index) => (
                <div key={index}>
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() =>
                          setIsCoursesDropdownOpen(!isCoursesDropdownOpen)
                        }
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                          isDark
                            ? "text-gray-300 hover:text-white hover:bg-gray-800"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {link.icon}
                          <span>{link.name}</span>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {isCoursesDropdownOpen && (
                        <div className="ml-8 mt-2 space-y-1">
                          {link.dropdown.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.href}
                              className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                                isDark
                                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              }`}
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={link.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </a>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              <div className="px-4 pt-4">
                <a
                  href="/payment"
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
