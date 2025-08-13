import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import LoadingSpinner, { SkeletonCard } from "../components/LoadingSpinner";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiTarget,
  FiFileText,
  FiMapPin,
  FiAlertCircle,
  FiPlus,
  FiSend,
  FiEdit3,
} from "react-icons/fi";

export default function Tasks() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState({
    employeeId: "",
    title: "",
    description: "",
    reMarks: "",
    taskDate: "",
    startTime: "",
    endTime: "",
    organization: "",
    priority: "Medium",
  });

  const { data: employees, isLoading: empLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => (await api.get("/employees")).data,
  });

  // Get task statistics
  const { data: allTasks = [] } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => (await api.get("/tasks")).data,
  });

  // Calculate stats from tasks data
  const taskStats = {
    totalTasks: allTasks.length,
    completedTasks: allTasks.filter((task) => task.completion === 100).length,
    inProgressTasks: allTasks.filter(
      (task) => task.completion > 0 && task.completion < 100
    ).length,
    pendingTasks: allTasks.filter((task) => task.completion === 0).length,
  };

  const assignTask = useMutation({
    mutationFn: async (newTask) =>
      (await api.post("/tasks/assign", newTask)).data,
    onSuccess: () => {
      toast.success("Task assigned successfully!");
      queryClient.invalidateQueries(["employees"]);
      queryClient.invalidateQueries(["allTasks"]);
      setTask({
        employeeId: "",
        title: "",
        description: "",
        reMarks: "",
        taskDate: "",
        startTime: "",
        endTime: "",
        organization: "",
        priority: "Medium",
      });
      setShowForm(false); // Hide form after successful submission
    },
  });

  const handleAssign = (e) => {
    e.preventDefault();
    assignTask.mutate(task);
  };

  if (empLoading) {
    return (
      <div className="p-4 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonCard />
          <SkeletonCard />
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
            Task Management
          </h1>
          <p className="text-gray-600">
            Assign tasks to employees and track their progress
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Task Assignment Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Assign New Task
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form
            onSubmit={handleAssign}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Employee Selection */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline w-4 h-4 mr-2" />
                Select Employee
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                value={task.employeeId}
                onChange={(e) =>
                  setTask({ ...task, employeeId: e.target.value })
                }
                required
              >
                <option value="">Choose an employee...</option>
                {employees.employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiTarget className="inline w-4 h-4 mr-2" />
                Task Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter task title..."
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                required
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="inline w-4 h-4 mr-2" />
                Organization
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter organization..."
                value={task.organization}
                onChange={(e) =>
                  setTask({ ...task, organization: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="inline w-4 h-4 mr-2" />
                Task Description
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe the task in detail..."
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
                required
              />
            </div>

            {/* Remarks */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiEdit3 className="inline w-4 h-4 mr-2" />
                Remarks (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Add any additional notes or remarks..."
                value={task.reMarks}
                onChange={(e) => setTask({ ...task, reMarks: e.target.value })}
              />
            </div>

            {/* Task Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline w-4 h-4 mr-2" />
                Task Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={task.taskDate}
                onChange={(e) => setTask({ ...task, taskDate: e.target.value })}
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiAlertCircle className="inline w-4 h-4 mr-2" />
                Priority Level
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
              >
                <option value="Low">🟢 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🔴 High Priority</option>
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiClock className="inline w-4 h-4 mr-2" />
                Start Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={task.startTime}
                onChange={(e) =>
                  setTask({ ...task, startTime: e.target.value })
                }
                required
                min="09:00"
                max="21:00"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiClock className="inline w-4 h-4 mr-2" />
                End Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={task.endTime}
                onChange={(e) => setTask({ ...task, endTime: e.target.value })}
                required
                min="09:00"
                max="21:00"
              />
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2 pt-4">
              <button
                type="submit"
                disabled={assignTask.isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assignTask.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    <span>Assign Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-blue-50">
              <FiTarget className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
              <p className="text-2xl font-bold text-gray-900">
                {taskStats.totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-green-50">
              <FiUser className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">
                Active Employees
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {employees?.employees?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-purple-50">
              <FiClock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">
                Completion Rate
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {taskStats.totalTasks > 0
                  ? Math.round(
                      (taskStats.completedTasks / taskStats.totalTasks) * 100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Assignment Tips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💡 Task Assignment Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Clear Task Titles</h4>
                <p className="text-sm text-gray-600">
                  Use descriptive titles that clearly indicate what needs to be
                  done
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-green-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Set Realistic Deadlines
                </h4>
                <p className="text-sm text-gray-600">
                  Consider employee workload and task complexity when setting
                  dates
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Priority Levels</h4>
                <p className="text-sm text-gray-600">
                  Use High priority sparingly for truly urgent tasks
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-yellow-600">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Detailed Descriptions
                </h4>
                <p className="text-sm text-gray-600">
                  Provide context, requirements, and expected outcomes
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-red-600">5</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Follow Up</h4>
                <p className="text-sm text-gray-600">
                  Check progress regularly and provide support when needed
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-indigo-600">6</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Track Analytics</h4>
                <p className="text-sm text-gray-600">
                  Monitor task completion rates and team performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🚀 Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/analytics"
            className="flex items-center justify-center space-x-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
          >
            <FiTarget className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">View All Tasks</span>
          </Link>

          <Link
            to="/employees"
            className="flex items-center justify-center space-x-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
          >
            <FiUser className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Manage Employees</span>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center justify-center space-x-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
          >
            <FiMapPin className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
