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

  if (isLoading) return <Loader />;

  return (
    <div className="p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Welcome back {user?.name || "Employee"}!
      </h1>
      <p className="text-gray-600 mb-6">
        Here you can view all your assigned tasks, track progress, and update
        your work completion status.
        <br />
        Stay organized and keep your tasks on track.
      </p>

      <h2 className="text-xl font-semibold mb-4">My Tasks</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-sm text-left">
              <th className="p-2 whitespace-nowrap">Title</th>
              <th className="p-2 whitespace-nowrap">Description</th>
              <th className="p-2 whitespace-nowrap">Start Time</th>
              <th className="p-2 whitespace-nowrap">End Time</th>
              <th className="p-2 whitespace-nowrap">Task Date</th>
              <th className="p-2 whitespace-nowrap">Organization</th>
              <th className="p-2 whitespace-nowrap">Priority</th>
              <th className="p-2 whitespace-nowrap">Completion (%)</th>
              <th className="p-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tasks.map((task) => (
              <tr key={task._id} className="border-b hover:bg-gray-50">
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
                    className="border p-1 w-20 rounded text-sm"
                    placeholder="0-100%"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleUpdateClick(task._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
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
