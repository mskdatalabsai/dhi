import React from "react";
import { Loader2 } from "lucide-react";

const ProfileHeader = ({ isDark, session, completion }: { isDark: boolean; session: any; completion: number }) => (
  <div className="mb-8">
    <h2 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
      Discover Your Perfect IT Career Path
    </h2>
    <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
      Answer a few questions to get personalized career recommendations tailored to your background and goals
    </p>
    {session?.user && (
      <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
        Logged in as: {session.user.email}
      </p>
    )}
    <div className="mt-6 flex items-center space-x-4">
      <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-teal-600 transition-all duration-500"
          style={{ width: `${completion}%` }}
        ></div>
      </div>
      <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {completion}% Complete
      </span>
    </div>
  </div>
);

export default ProfileHeader;