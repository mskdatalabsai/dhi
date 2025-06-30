"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  LogOut,
  LogIn,
} from "lucide-react";

type NavbarProps = {
  isDark: boolean;
  toggleTheme: () => void;
  isAuthenticated?: boolean;
};

const Navbar = ({ isDark, toggleTheme }: NavbarProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link href="/" className="flex items-center space-x-4">
            <img src="/logo.png" alt="DHITI Logo" className="h-12 w-auto" />

            {/* Tagline */}
            <div className="hidden md:block border-l border-gray-300 dark:border-gray-600 pl-4">
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Discover Heuristic Insights Through Intelligence
              </span>
            </div>
          </Link>

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
            {/* User Info & Auth */}
            {session ? (
              <div className="hidden md:flex items-center space-x-3">
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => router.push("/auth/signin")}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

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
              <button
                onClick={() => {
                  if (session) {
                    router.push("/survey");
                  } else {
                    router.push("/auth/signin");
                  }
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {session ? "Go to Assessment" : "Get Started"}
              </button>
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

              {/* Mobile Auth Section */}
              {session ? (
                <div className="border-t border-gray-700 pt-4 px-4">
                  <p
                    className={`text-sm mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {session.user?.email}
                  </p>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
                      isDark
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-700 pt-4 px-4">
                  <button
                    onClick={() => router.push("/auth/signin")}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
                      isDark
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              {/* Mobile CTA */}
              <div className="px-4 pt-4">
                <button
                  onClick={() => {
                    if (session) {
                      router.push("/survey");
                    } else {
                      router.push("/auth/signin");
                    }
                  }}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
                >
                  {session ? "Go to Assessment" : "Get Started"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
