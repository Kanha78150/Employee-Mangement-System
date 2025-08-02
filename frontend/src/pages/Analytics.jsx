import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Analytics() {
  // Search state
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const employeeId = user?.id;

  // Fetch all tasks
  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ["allTasks", employeeId],
    queryFn: async () => (await api.get(`/tasks/employee/${employeeId}`)).data,
  });

  //! StandBy
  // const { data: tasks = [], isLoading } = useQuery({
  //   queryKey: ["employeeTasks", user?.id],
  //   queryFn: async () => (await api.get(`/tasks/employee/${user.id}`)).data,
  // });

  // Format date utility
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter tasks based on search input
  const filteredTasks = allTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.organization.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="p-4">Loading tasks...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>
      <input
        type="text"
        className="border p-2 mb-4 w-full"
        placeholder="Search by title, description, or organization"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2">Employee</th>
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Date</th>
            <th className="p-2">Org</th>
            <th className="p-2">Priority</th>
            <th className="p-2">Completion</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((t) => (
            <tr key={t._id} className="border-b">
              <td className="p-2">{t.employeeName || t.employeeId}</td>
              <td className="p-2">{t.title}</td>
              <td className="p-2">{t.description}</td>
              <td className="p-2">{t.startTime}</td>
              <td className="p-2">{t.endTime}</td>
              <td className="p-2">{formatDate(t.taskDate)}</td>
              <td className="p-2">{t.organization}</td>
              <td className="p-2">{t.priority}</td>
              <td className="p-2">{t.completion ?? 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
