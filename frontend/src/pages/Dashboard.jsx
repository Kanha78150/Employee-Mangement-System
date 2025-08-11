import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import LoadingSpinner, { SkeletonCard } from "../components/LoadingSpinner";
import {
  FaAddressBook,
  FaChartLine,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { SiGoogletasks } from "react-icons/si";
import { FiUsers, FiTrendingUp, FiActivity } from "react-icons/fi";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await api.get("/analytics")).data,
  });

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 space-y-8">
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

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-xl mb-2">
            ⚠️ Error Loading Dashboard
          </div>
          <p className="text-red-700">
            Unable to load dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Employees",
      value: data?.totalEmployees || 0,
      icon: FiUsers,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Total Tasks",
      value: data?.totalTasks || 0,
      icon: SiGoogletasks,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Completed Tasks",
      value: data?.completedTasks || 0,
      icon: FaCheckCircle,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      change: "+15%",
      changeType: "increase",
    },
    {
      title: "Pending Tasks",
      value: data?.pendingTasks || 0,
      icon: FaClock,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      change: "-5%",
      changeType: "decrease",
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Monitor your team's performance and manage operations efficiently.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiActivity className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  stat.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <FiTrendingUp className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <FaAddressBook className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Add Employee</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <SiGoogletasks className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Create Task</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <FaChartLine className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
