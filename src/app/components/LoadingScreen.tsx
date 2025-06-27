import React from "react";
import Navbar from "./Navbar";

const LoadingScreen: React.FC<{ isDark: boolean; toggleTheme: () => void }> = ({
  isDark,
  toggleTheme,
}) => (
  <div
    className={`h-screen overflow-hidden ${
      isDark ? "bg-gray-900" : "bg-gray-50"
    }`}
  >
    <Navbar isDark={isDark} toggleTheme={toggleTheme} />
    <div className="h-full flex items-center justify-center pt-20">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
    </div>
  </div>
);

export default LoadingScreen;
