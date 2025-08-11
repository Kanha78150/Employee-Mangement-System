import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  FiTrash2,
  FiEye,
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

  const { data: allTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => (await api.get("/tasks")).data,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const assignTask = useMutation({
    mutationFn: async (newTask) =>
      (await api.post("/tasks/assign", newTask)).data,
    onSuccess: () => {
      toast.success("Task assigned successfully!");
      queryClient.invalidateQueries(["employees"]);
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
    },
  });

  const handleAssign = (e) => {
    e.preventDefault();
    assignTask.mutate(task);
  };

  if (empLoading || tasksLoading) {
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
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Assign New Task
          </h3>
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

      {/* Assigned Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Assigned Tasks
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiTarget className="w-4 h-4" />
            <span>{allTasks.length} tasks assigned</span>
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
                    <FiUser className="w-4 h-4" />
                    <span>Assigned To</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiClock className="w-4 h-4" />
                    <span>Schedule</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority & Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FiTarget className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">
                        No tasks assigned yet
                      </p>
                      <p className="text-sm">
                        Start by assigning your first task to an employee
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                allTasks.map((task) => (
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

                    {/* Assigned To */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {task.employee?.name || "Unassigned"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.employee?.employeeId || "No ID"}
                          </div>
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

                    {/* Priority & Progress */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
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
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {task.completion || 0}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
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
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="inline-flex items-center p-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          className="inline-flex items-center p-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                          title="Edit Task"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="inline-flex items-center p-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                          title="Delete Task"
                        >
                          <FiTrash2 className="w-4 h-4" />
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
