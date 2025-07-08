/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  Trash2,
  Edit,
  RefreshCw,
  TrendingUp,
  Eye,
  Clock,
  Award,
  Target,
  BookOpen,
} from "lucide-react";

// Properly typed User interface
interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
  provider?: string;
}

interface Survey {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  score: number;
  percentage: number;
  totalQuestions: number;
  questionsAttempted: number;
  correctAnswers: number;
  totalTimeUsed: number;
  performanceByLevel?: any;
  performanceByCategory?: any;
  profileSnapshot?: any;
  submittedAt: string;
  completedAt?: string;
}

interface Profile {
  id: string;
  userId: string;
  email: string;
  age_group: string;
  education: string;
  experience: string;
  purpose: string;
  functional_area: string;
  roles: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error] = useState("");

  // Type-safe session.user
  const user = session?.user as
    | {
        name?: string;
        email: string;
        role: string;
        id: string;
      }
    | undefined;

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !user || user.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router, user]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "users", label: "Users", icon: Users },
    { id: "surveys", label: "Survey Results", icon: FileText },
    { id: "profiles", label: "User Profiles", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/api/auth/signout";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "users":
        return <UsersView />;
      case "surveys":
        return <SurveysView />;
      case "profiles":
        return <ProfilesView />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  // Check loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Check if user is not admin - show error and redirect
  if (!session || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="mb-4">
              You need admin privileges to access this page.
            </p>
            <p className="text-sm mb-4">Current role: {user?.role || "none"}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 relative`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`font-bold text-xl ${!sidebarOpen && "hidden"}`}>
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div
              className={`mb-4 pb-4 border-t border-gray-800 pt-4 ${
                !sidebarOpen && "hidden"
              }`}
            >
              <p className="text-sm text-gray-400">Signed in as:</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <LogOut size={20} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              {menuItems.find((item) => item.id === activeTab)?.label}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name || user.email}
              </span>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {(user.name || user.email || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// -----------------------------------------
// DashboardView
// -----------------------------------------
function DashboardView() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if data has the expected structure
      if (!data || !data.stats) {
        throw new Error("Invalid data structure received from API");
      }

      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(error instanceof Error ? error.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Failed to load dashboard data</div>
        <div className="text-sm text-gray-600">{error}</div>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats || !stats.stats) {
    return (
      <div className="text-center py-8 text-red-500">No data available</div>
    );
  }

  // Provide default values if data is missing
  const defaultStat = { value: 0, change: "0%", label: "Loading..." };

  const statCards = [
    {
      ...defaultStat,
      ...stats.stats.totalUsers,
      color: "bg-blue-500",
      icon: Users,
    },
    {
      ...defaultStat,
      ...stats.stats.activeProfiles,
      color: "bg-green-500",
      icon: TrendingUp,
    },
    {
      ...defaultStat,
      ...stats.stats.surveyResponses,
      color: "bg-purple-500",
      icon: FileText,
    },
    {
      ...defaultStat,
      ...stats.stats.completionRate,
      color: "bg-orange-500",
      icon: BarChart3,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}
                >
                  <Icon
                    size={24}
                    className={stat.color.replace("bg-", "text-")}
                  />
                </div>
                <span className="text-green-500 text-sm font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {stats.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name || "Unknown"}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent users</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Recent Survey Submissions
          </h3>
          <div className="space-y-3">
            {stats.recentSurveys && stats.recentSurveys.length > 0 ? (
              stats.recentSurveys.map((survey: any) => (
                <div
                  key={survey.id}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div>
                    <p className="font-medium">
                      {survey.userName || survey.userEmail}
                    </p>
                    <p className="text-sm text-gray-500">
                      Score: {survey.score}/{survey.percentage}%
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(survey.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent surveys</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------
// UsersView Component (keeping original)
// -----------------------------------------
function UsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?search=${searchTerm}`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete ${userEmail}?`)) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            User Management ({users.length} users)
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && fetchUsers()}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No users found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || "No name"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleUpdateRole(user.id, e.target.value)
                        }
                        onBlur={() => setEditingUser(null)}
                        className="text-sm border rounded px-2 py-1"
                        autoFocus
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.provider
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.provider || "Email"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------
// SurveysView Component (NEW)
// -----------------------------------------
function SurveysView() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/surveys?limit=50");
      const data = await response.json();
      setSurveys(data.surveys || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const viewSurveyDetails = async (surveyId: string) => {
    try {
      const response = await fetch("/api/admin/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId }),
      });
      const data = await response.json();
      setSelectedSurvey(data.survey);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching survey details:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading surveys...</div>;
  }

  if (showDetails && selectedSurvey) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Survey Details</h3>
            <button
              onClick={() => {
                setShowDetails(false);
                setSelectedSurvey(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back to List
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2">User Information</h4>
              <p className="text-sm text-gray-600">
                Email: {selectedSurvey.email}
              </p>
              <p className="text-sm text-gray-600">
                Name: {selectedSurvey.userName}
              </p>
              <p className="text-sm text-gray-600">
                Submitted:{" "}
                {new Date(selectedSurvey.submittedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Performance</h4>
              <p className="text-sm text-gray-600">
                Score: {selectedSurvey.score}/{selectedSurvey.totalQuestions} (
                {selectedSurvey.percentage}%)
              </p>
              <p className="text-sm text-gray-600">
                Time Used: {formatTime(selectedSurvey.totalTimeUsed)}
              </p>
              <p className="text-sm text-gray-600">
                Questions Attempted: {selectedSurvey.questionsAttempted}/
                {selectedSurvey.totalQuestions}
              </p>
            </div>
          </div>

          {selectedSurvey.profileSnapshot && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Profile Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Age Group:</span>{" "}
                  {selectedSurvey.profileSnapshot.age_group}
                </div>
                <div>
                  <span className="text-gray-600">Education:</span>{" "}
                  {selectedSurvey.profileSnapshot.education}
                </div>
                <div>
                  <span className="text-gray-600">Experience:</span>{" "}
                  {selectedSurvey.profileSnapshot.experience}
                </div>
                <div>
                  <span className="text-gray-600">Purpose:</span>{" "}
                  {selectedSurvey.profileSnapshot.purpose}
                </div>
              </div>
            </div>
          )}

          {selectedSurvey.performanceByLevel && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Performance by Level</h4>
              <div className="space-y-2">
                {Object.entries(selectedSurvey.performanceByLevel).map(
                  ([level, data]: [string, any]) => (
                    <div
                      key={level}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm capitalize">{level}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${data.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {data.correct}/{data.total} ({data.percentage}%)
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Surveys</p>
                <p className="text-2xl font-semibold">{stats.totalSurveys}</p>
              </div>
              <FileText className="text-purple-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-semibold">{stats.averageScore}%</p>
              </div>
              <Award className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-semibold">
                  {stats.completionRate}%
                </p>
              </div>
              <Target className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Time</p>
                <p className="text-2xl font-semibold">
                  {formatTime(stats.averageTimeUsed)}
                </p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Survey Results ({surveys.length} surveys)
            </h3>
            <button
              onClick={fetchSurveys}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {surveys.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No surveys found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {surveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {survey.userName || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {survey.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {survey.score}/{survey.totalQuestions}
                        </span>
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            survey.percentage >= 80
                              ? "bg-green-100 text-green-800"
                              : survey.percentage >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {survey.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            survey.percentage >= 80
                              ? "bg-green-500"
                              : survey.percentage >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${survey.percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(survey.totalTimeUsed)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(survey.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewSurveyDetails(survey.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------
// ProfilesView Component (NEW)
// -----------------------------------------
function ProfilesView() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/profiles?search=${searchTerm}`);
      const data = await response.json();
      setProfiles(data.profiles || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profiles...</div>;
  }

  return (
    <div>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Profiles</p>
            <p className="text-2xl font-semibold">{stats.totalProfiles}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Most Common Education</p>
            <p className="text-lg font-semibold">
              {Object.entries(stats.byEducation).sort(
                (a: any, b: any) => b[1] - a[1]
              )[0]?.[0] || "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Most Common Experience</p>
            <p className="text-lg font-semibold">
              {Object.entries(stats.byExperience).sort(
                (a: any, b: any) => b[1] - a[1]
              )[0]?.[0] || "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Top Functional Area</p>
            <p className="text-lg font-semibold">
              {Object.entries(stats.byFunctionalArea).sort(
                (a: any, b: any) => b[1] - a[1]
              )[0]?.[0] || "N/A"}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              User Profiles ({profiles.length} profiles)
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && fetchProfiles()}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={fetchProfiles}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>

        {profiles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No profiles found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demographics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {profile.email}
                        </div>
                        <div className="text-gray-500">{profile.purpose}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{profile.age_group}</div>
                        <div className="text-gray-500">{profile.education}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {profile.experience}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {profile.functional_area}
                        </div>
                        <div className="text-gray-500 truncate max-w-xs">
                          {profile.roles}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------
// AnalyticsView Component (UPDATED)
// -----------------------------------------
function AnalyticsView() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch both surveys and profiles for analytics
      const [surveysRes, profilesRes] = await Promise.all([
        fetch("/api/admin/surveys?limit=100"),
        fetch("/api/admin/profiles?limit=100"),
      ]);

      const surveysData = await surveysRes.json();
      const profilesData = await profilesRes.json();

      setAnalytics({
        surveys: surveysData,
        profiles: profilesData,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (!analytics) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Survey Performance Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Score Distribution
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">0-40%</span>
                <span className="text-sm font-medium">
                  {
                    analytics.surveys.surveys.filter(
                      (s: any) => s.percentage < 40
                    ).length
                  }{" "}
                  users
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">40-60%</span>
                <span className="text-sm font-medium">
                  {
                    analytics.surveys.surveys.filter(
                      (s: any) => s.percentage >= 40 && s.percentage < 60
                    ).length
                  }{" "}
                  users
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">60-80%</span>
                <span className="text-sm font-medium">
                  {
                    analytics.surveys.surveys.filter(
                      (s: any) => s.percentage >= 60 && s.percentage < 80
                    ).length
                  }{" "}
                  users
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">80-100%</span>
                <span className="text-sm font-medium">
                  {
                    analytics.surveys.surveys.filter(
                      (s: any) => s.percentage >= 80
                    ).length
                  }{" "}
                  users
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Completion Stats
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Attempts</span>
                <span className="text-sm font-medium">
                  {analytics.surveys.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-medium">
                  {
                    analytics.surveys.surveys.filter(
                      (s: any) => s.questionsAttempted === s.totalQuestions
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Time</span>
                <span className="text-sm font-medium">
                  {Math.round(analytics.surveys.stats.averageTimeUsed / 60)}m
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Top Performers
            </h4>
            <div className="space-y-1">
              {analytics.surveys.surveys
                .sort((a: any, b: any) => b.percentage - a.percentage)
                .slice(0, 3)
                .map((survey: any, index: number) => (
                  <div key={survey.id} className="flex justify-between text-sm">
                    <span className="truncate">
                      {survey.userName || survey.userEmail}
                    </span>
                    <span className="font-medium">{survey.percentage}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">User Demographics</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              By Education
            </h4>
            <div className="space-y-1">
              {Object.entries(analytics.profiles.stats.byEducation)
                .sort((a: any, b: any) => b[1] - a[1])
                .map(([education, count]: [string, any]) => (
                  <div key={education} className="flex justify-between text-sm">
                    <span className="truncate">{education}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              By Experience
            </h4>
            <div className="space-y-1">
              {Object.entries(analytics.profiles.stats.byExperience)
                .sort((a: any, b: any) => b[1] - a[1])
                .map(([experience, count]: [string, any]) => (
                  <div
                    key={experience}
                    className="flex justify-between text-sm"
                  >
                    <span className="truncate">{experience}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              By Age Group
            </h4>
            <div className="space-y-1">
              {Object.entries(analytics.profiles.stats.byAgeGroup)
                .sort((a: any, b: any) => b[1] - a[1])
                .slice(0, 5)
                .map(([ageGroup, count]: [string, any]) => (
                  <div key={ageGroup} className="flex justify-between text-sm">
                    <span className="truncate">{ageGroup.split(" ")[0]}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Top Areas
            </h4>
            <div className="space-y-1">
              {Object.entries(analytics.profiles.stats.byFunctionalArea)
                .sort((a: any, b: any) => b[1] - a[1])
                .slice(0, 3)
                .map(([area, count]: [string, any]) => (
                  <div key={area} className="flex justify-between text-sm">
                    <span className="truncate">{area.split(" ")[0]}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Settings</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Site Configuration</h4>
          <p className="text-gray-600 text-sm">
            Configure site-wide settings and preferences.
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Security Settings</h4>
          <p className="text-gray-600 text-sm">
            Manage security policies and access controls.
          </p>
        </div>
      </div>
    </div>
  );
}
