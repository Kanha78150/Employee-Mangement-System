import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../UI/Loader";

export default function EmployeeTasks() {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const [editValues, setEditValues] = useState({});
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const { data: employeeDetails } = useQuery({
    queryKey: ["employeeDetails", user.id],
    queryFn: async () => (await api.get(`/employees/${user.id}`)).data,
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

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["employeeTasks", user?.id],
    queryFn: async () => (await api.get(`/tasks/employee/${user.id}`)).data,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, completion }) =>
      (await api.put(`/tasks/update/${id}`, { completion })).data,
    onSuccess: () => {
      toast.success("Task Status Updated Successfully");
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

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 max-w-full overflow-x-hidden">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Welcome back {employeeDetails?.name || "Employee"}!
      </h1>
      <p className="text-gray-600 mb-6">
        Here you can view all your assigned tasks, track progress, and update
        your work completion status.
        <br />
        Stay organized and keep your tasks on track.
      </p>

      <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
      <div className="overflow-x-auto">
        {/* Filters with responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <select
            className="border p-2 rounded w-full sm:w-40 bg-gray-100"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded w-full sm:w-40 bg-gray-100"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Responsive tasks table */}
        <table className="min-w-full table-auto bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-xs sm:text-sm text-left">
              <th className="p-2 whitespace-nowrap max-w-[120px]">Title</th>
              <th className="p-2 whitespace-nowrap max-w-[150px] hidden sm:table-cell">
                Description
              </th>
              <th className="p-2 whitespace-nowrap">Start Time</th>
              <th className="p-2 whitespace-nowrap">End Time</th>
              <th className="p-2 whitespace-nowrap hidden md:table-cell">
                Task Date
              </th>
              <th className="p-2 whitespace-nowrap hidden lg:table-cell">
                Organization
              </th>
              <th className="p-2 whitespace-nowrap">Priority</th>
              <th className="p-2 whitespace-nowrap">Completion (%)</th>
              <th className="p-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            {filteredTasks.map((task) => (
              <tr key={task._id} className="border-b hover:bg-gray-50">
                <td className="p-2 max-w-[120px] truncate" title={task.title}>
                  {task.title}
                </td>
                <td
                  className="p-2 max-w-[150px] truncate hidden sm:table-cell"
                  title={task.description}
                >
                  {task.description}
                </td>
                <td className="p-2">{task.startTime}</td>
                <td className="p-2">{task.endTime}</td>
                <td className="p-2 hidden md:table-cell">
                  {formatDate(task.taskDate)}
                </td>
                <td
                  className="p-2 hidden lg:table-cell truncate max-w-[150px]"
                  title={task.organization}
                >
                  {task.organization}
                </td>
                <td className="p-2">{task.priority}</td>
                <td className="p-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={
                      task._id in editValues
                        ? editValues[task._id] === 0
                          ? ""
                          : editValues[task._id]
                        : task.completion
                    }
                    onChange={(e) =>
                      handleInputChange(task._id, e.target.value)
                    }
                    className="border p-1 w-16 sm:w-20 rounded text-sm"
                    placeholder="0-100%"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleUpdateClick(task._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
