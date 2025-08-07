import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axiosInstance";
import Loader from "../UI/Loader";

export default function Analytics() {
  const [search, setSearch] = useState("");

  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => (await api.get(`/tasks`)).data,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredTasks = allTasks.filter((t) => {
    const title = (t.title ?? "").toLowerCase();
    const desc = (t.description ?? "").toLowerCase();
    const org = (t.organization ?? "").toLowerCase();
    const term = search.toLowerCase();
    return title.includes(term) || desc.includes(term) || org.includes(term);
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 overflow-auto h-screen">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Assigned Tasks</h2>

      <input
        type="text"
        className="border p-2 mb-4 w-full sm:w-2/3 md:w-1/2 bg-gray-100 rounded"
        placeholder="Search by title, employee name, or organization"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full bg-white shadow rounded text-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">End</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Org</th>
              <th className="p-2 text-left">Priority</th>
              <th className="p-2 text-left">Completion</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{t.employee?.name ?? "-"}</td>
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
    </div>
  );
}
