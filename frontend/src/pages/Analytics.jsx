import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import LoadingSpinner, { SkeletonCard } from "../components/LoadingSpinner";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiBarChart2,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiUsers,
  FiTarget,
  FiUser,
  FiPlus,
  FiArrowRight,
  FiSend,
} from "react-icons/fi";

export default function Analytics() {
  const [search, setSearch] = useState("");
  const [completionRange, setCompletionRange] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const { data: tasksResponse, isLoading } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => (await api.get(`/tasks`)).data,
  });

  // Extract tasks array from response
  const allTasks = tasksResponse?.data || [];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSubmissionTime = (submissionTime) => {
    if (!submissionTime) return null;
    const date = new Date(submissionTime);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const formatLastUpdateTime = (lastUpdatedTime) => {
    if (!lastUpdatedTime) return null;
    const date = new Date(lastUpdatedTime);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return {
        date: "Invalid Date",
        time: "-",
        relative: "Invalid",
      };
    }

    // Get the start of today for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updateDate = new Date(date);
    updateDate.setHours(0, 0, 0, 0);

    const diffInMs = now - date;
    const diffInMinutes = diffInMs / (1000 * 60);
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const formatTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formatFullDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Check if it's actually today
    if (updateDate.getTime() === today.getTime()) {
      // Same day - show relative time
      if (diffInMinutes < 1) {
        return {
          date: "Today",
          time: formatTime,
          relative: "Just now",
        };
      } else if (diffInHours < 1) {
        return {
          date: "Today",
          time: formatTime,
          relative: `${Math.floor(diffInMinutes)}m ago`,
        };
      } else {
        return {
          date: "Today",
          time: formatTime,
          relative: `${Math.floor(diffInHours)}h ago`,
        };
      }
    } else if (diffInDays === 1) {
      // Yesterday
      return {
        date: "Yesterday",
        time: formatTime,
        relative: "Yesterday",
      };
    } else if (diffInDays > 0 && diffInDays <= 7) {
      // Within a week
      return {
        date: formatFullDate,
        time: formatTime,
        relative: `${diffInDays}d ago`,
      };
    } else if (diffInDays < 0) {
      // Future date (should not happen in normal cases)
      return {
        date: formatFullDate,
        time: formatTime,
        relative: "Future date",
      };
    } else {
      // More than a week ago
      return {
        date: formatFullDate,
        time: formatTime,
        relative: `${diffInDays}d ago`,
      };
    }
  };

  const filteredTasks = allTasks.filter((t) => {
    const title = (t.title ?? "").toLowerCase();
    const desc = (t.description ?? "").toLowerCase();
    const org = (t.organization ?? "").toLowerCase();
    const term = search.toLowerCase();
    const matchesText =
      title.includes(term) || desc.includes(term) || org.includes(term);
    let matchesCompletion = true;
    if (completionRange) {
      const completion = Number(t.completion ?? 0);
      if (completionRange === "10-30")
        matchesCompletion = completion >= 10 && completion <= 30;
      if (completionRange === "30-60")
        matchesCompletion = completion > 30 && completion <= 60;
      if (completionRange === "60-100")
        matchesCompletion = completion > 60 && completion <= 100;
    }

    let matchesDate = true;
    if (dateFilter) {
      const taskDate = t.taskDate
        ? new Date(t.taskDate).toISOString().split("T")[0]
        : "";
      matchesDate = taskDate === dateFilter;
    }

    return matchesText && matchesCompletion && matchesDate;
  });

  // Calculate analytics data
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.completion === 100).length;
  const inProgressTasks = allTasks.filter(
    (t) => t.completion > 0 && t.completion < 100
  ).length;
  const pendingTasks = allTasks.filter((t) => t.completion === 0).length;
  const averageCompletion =
    totalTasks > 0
      ? Math.round(
          allTasks.reduce((sum, t) => sum + (t.completion || 0), 0) / totalTasks
        )
      : 0;

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Task Analytics
          </h1>
          <p className="text-gray-600">
            Monitor task progress and team performance
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4 lg:mt-0">
          <FiBarChart2 className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-50">
              <FiTarget className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-blue-600">
              <FiTrendingUp className="w-4 h-4" />
              <span>Total</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {totalTasks}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-50">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <FiTrendingUp className="w-4 h-4" />
              <span>
                {totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {completedTasks}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-yellow-50">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-yellow-600">
              <FiTrendingUp className="w-4 h-4" />
              <span>
                {totalTasks > 0
                  ? Math.round((inProgressTasks / totalTasks) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {inProgressTasks}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-red-50">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-red-600">
              <FiTrendingUp className="w-4 h-4" />
              <span>{averageCompletion}%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">
              Avg. Completion
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {averageCompletion}%
            </p>
          </div>
        </div>
      </div>

      {/* Quick Task Assignment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quick Actions
            </h3>
            <p className="text-gray-600">
              Manage tasks and assignments efficiently
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to="/tasks"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Assign New Task
            </Link>
            <Link
              to="/employees"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              <FiUsers className="w-4 h-4 mr-2" />
              Manage Employees
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              <FiBarChart2 className="w-4 h-4 mr-2" />
              View Dashboard
              <FiArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Task Filters</h3>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={completionRange}
                onChange={(e) => setCompletionRange(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-48 appearance-none bg-white"
              >
                <option value="">All Completion</option>
                <option value="10-30">10% - 30%</option>
                <option value="30-60">30% - 60%</option>
                <option value="60-100">60% - 100%</option>
              </select>
            </div>

            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-48"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiUsers className="w-4 h-4" />
            <span>
              Showing {filteredTasks.length} of {totalTasks} tasks
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiUsers className="w-4 h-4" />
                    <span>Task Info</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiClock className="w-4 h-4" />
                    <span>Last Update</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FiTarget className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No tasks found</p>
                      <p className="text-sm">
                        {search || completionRange || dateFilter
                          ? "Try adjusting your filters"
                          : "No tasks available"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr
                    key={t._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Task Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {t.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t.description}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <FiUser className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {t.employee?.name || "Unassigned"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Timeline */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          <span className="text-gray-500">Date:</span>{" "}
                          {formatDate(t.taskDate)}
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="text-gray-500">Time:</span>{" "}
                          {t.startTime} - {t.endTime}
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {t.organization}
                        </span>
                        <div className="text-sm">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              t.priority === "High"
                                ? "bg-red-100 text-red-800"
                                : t.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Last Update Time */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {t.lastUpdatedTime ? (
                          <>
                            <div className="flex items-center space-x-2">
                              <FiClock className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-blue-700">
                                {
                                  formatLastUpdateTime(t.lastUpdatedTime)
                                    ?.relative
                                }
                              </span>
                            </div>
                            <div className="text-sm text-gray-900">
                              <span className="text-gray-500">Date:</span>{" "}
                              {formatLastUpdateTime(t.lastUpdatedTime)?.date}
                            </div>
                            <div className="text-sm text-gray-900">
                              <span className="text-gray-500">Time:</span>{" "}
                              {formatLastUpdateTime(t.lastUpdatedTime)?.time}
                            </div>
                            {t.lastUpdatedBy && (
                              <div className="text-xs text-gray-500">
                                <span className="text-gray-400">By:</span>{" "}
                                {t.lastUpdatedBy.name || "Unknown"}
                              </div>
                            )}
                            {t.completion === 100 && t.submissionTime && (
                              <div className="flex items-center space-x-1 mt-2">
                                <FiSend className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">
                                  Submitted:{" "}
                                  {formatSubmissionTime(t.submissionTime)?.date}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <FiClock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              No updates yet
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {t.completion || 0}%
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              (t.completion || 0) === 100
                                ? "bg-green-100 text-green-800"
                                : (t.completion || 0) > 50
                                ? "bg-blue-100 text-blue-800"
                                : (t.completion || 0) > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {(t.completion || 0) === 100
                              ? "Complete"
                              : (t.completion || 0) > 0
                              ? "In Progress"
                              : "Pending"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              (t.completion || 0) === 100
                                ? "bg-green-500"
                                : (t.completion || 0) > 50
                                ? "bg-blue-500"
                                : (t.completion || 0) > 0
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${t.completion || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
