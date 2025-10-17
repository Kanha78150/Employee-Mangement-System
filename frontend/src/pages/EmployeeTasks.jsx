import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import LoadingSpinner, { SkeletonCard } from "../components/LoadingSpinner";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiTarget,
  FiFilter,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";

export default function EmployeeTasks() {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const [editValues, setEditValues] = useState({});
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const { data: employeeDetails } = useQuery({
    queryKey: ["employeeDetails", user.id],
    queryFn: async () => {
      const response = await api.get(`/employees/${user.id}`);
      return response.data?.data || response.data;
    },
    enabled: !!user?.id,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const { data: tasksResponse, isLoading } = useQuery({
    queryKey: ["employeeTasks", user?.id],
    queryFn: async () => (await api.get(`/tasks/employee/${user.id}`)).data,
  });

  // Extract tasks array from response
  const tasks = tasksResponse?.data || [];

  const updateStatus = useMutation({
    mutationFn: async ({ id, completion }) =>
      (await api.put(`/tasks/update/${id}`, { completion })).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["employeeTasks", user?.id]);
    },
  });

  const handleInputChange = (taskId, value) => {
    const clampedValue = Math.max(0, Math.min(100, Number(value)));
    setEditValues((prev) => ({
      ...prev,
      [taskId]: clampedValue,
    }));
  };

  const handleUpdateClick = (taskId) => {
    if (editValues[taskId] !== undefined) {
      updateStatus.mutate({
        id: taskId,
        completion: editValues[taskId],
      });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = priorityFilter
      ? (task.priority ?? "").toLowerCase() === priorityFilter.toLowerCase()
      : true;

    const matchesDate = dateFilter
      ? task.taskDate
        ? new Date(task.taskDate).toISOString().split("T")[0] === dateFilter
        : false
      : true;

    return matchesPriority && matchesDate;
  });

  // Calculate task statistics
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(
    (t) => t.completion === 100
  ).length;
  const inProgressTasks = filteredTasks.filter(
    (t) => t.completion > 0 && t.completion < 100
  ).length;
  const pendingTasks = filteredTasks.filter((t) => t.completion === 0).length;
  const averageCompletion =
    totalTasks > 0
      ? Math.round(
          filteredTasks.reduce((sum, t) => sum + (t.completion || 0), 0) /
            totalTasks
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
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {employeeDetails?.name || "Employee"}!
          </h1>
          <p className="text-gray-600">
            Track your assigned tasks and update your progress efficiently.
          </p>
        </div>
      </div>

      {/* Task Statistics */}
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
            <h3 className="text-sm font-medium text-gray-600">My Tasks</h3>
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
            <div className="p-3 rounded-lg bg-purple-50">
              <FiAlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-purple-600">
              <FiTrendingUp className="w-4 h-4" />
              <span>{averageCompletion}%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">Avg. Progress</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {averageCompletion}%
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Task Filters</h3>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-48 appearance-none bg-white"
              >
                <option value="">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
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
          <h3 className="text-lg font-semibold text-gray-900">My Task List</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiTarget className="w-4 h-4" />
            <span>Showing {filteredTasks.length} tasks</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiTarget className="w-4 h-4" />
                    <span>Task Details</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiClock className="w-4 h-4" />
                    <span>Schedule</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                        {priorityFilter || dateFilter
                          ? "Try adjusting your filters"
                          : "No tasks assigned yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Task Details */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {task.description}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {task.organization}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          <span className="text-gray-500">Date:</span>{" "}
                          {formatDate(task.taskDate)}
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="text-gray-500">Time:</span>{" "}
                          {task.startTime} - {task.endTime}
                        </div>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="px-6 py-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {task.completion || 0}%
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              (task.completion || 0) === 100
                                ? "bg-green-100 text-green-800"
                                : (task.completion || 0) > 50
                                ? "bg-blue-100 text-blue-800"
                                : (task.completion || 0) > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {(task.completion || 0) === 100
                              ? "Complete"
                              : (task.completion || 0) > 0
                              ? "In Progress"
                              : "Pending"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              (task.completion || 0) === 100
                                ? "bg-green-500"
                                : (task.completion || 0) > 50
                                ? "bg-blue-500"
                                : (task.completion || 0) > 0
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${task.completion || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="space-y-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={
                            task._id in editValues
                              ? editValues[task._id] === 0
                                ? ""
                                : editValues[task._id]
                              : task.completion || ""
                          }
                          onChange={(e) =>
                            handleInputChange(task._id, e.target.value)
                          }
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center"
                          placeholder="0-100"
                        />
                        <button
                          onClick={() => handleUpdateClick(task._id)}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <FiRefreshCw className="w-4 h-4" />
                          <span>Update</span>
                        </button>
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
