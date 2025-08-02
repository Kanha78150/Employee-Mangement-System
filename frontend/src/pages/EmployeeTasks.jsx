import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function EmployeeTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [editValues, setEditValues] = useState({});
  // To Get Proper Date Format
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch employee tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["employeeTasks", user?.id],
    queryFn: async () => (await api.get(`/tasks/employee/${user.id}`)).data,
  });

  // Update task status
  const updateStatus = useMutation({
    mutationFn: async ({ id, completion }) =>
      (await api.put(`/tasks/update/${id}`, { completion })).data,
    onSuccess: () => queryClient.invalidateQueries(["employeeTasks", user?.id]),
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

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Start Time</th>
            <th className="p-2">End Time</th>
            <th className="p-2">Task Date</th>
            <th className="p-2">Organization</th>
            <th className="p-2">Priority</th>
            <th className="p-2">Completion (%)</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b">
              <td className="p-2">{task.title}</td>
              <td className="p-2">{task.description}</td>
              <td className="p-2">{task.startTime}</td>
              <td className="p-2">{task.endTime}</td>
              <td className="p-2">{formatDate(task.taskDate)}</td>
              <td className="p-2">{task.organization}</td>
              <td className="p-2">{task.priority}</td>
              <td className="p-2">
                <input
                  type="number"
                  value={
                    task._id in editValues
                      ? editValues[task._id] === 0
                        ? ""
                        : editValues[task._id]
                      : task.completion
                  }
                  onChange={(e) => handleInputChange(task._id, e.target.value)}
                  className="border p-1 w-20"
                  placeholder="0-100%"
                />
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleUpdateClick(task._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
