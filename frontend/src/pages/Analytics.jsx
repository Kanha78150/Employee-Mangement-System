import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axiosInstance";
import Loader from "../UI/Loader";

export default function Analytics() {
  const [search, setSearch] = useState("");
  const [completionRange, setCompletionRange] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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

  if (isLoading) return <Loader />;

  return (
    <div className="p-2 sm:p-4 max-w-screen-lg mx-auto w-full">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4">
        Assigned Tasks
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8 mb-4">
        <input
          type="text"
          className="border p-2 w-full sm:w-64 bg-gray-100 rounded"
          placeholder="Search by title, and org"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 bg-gray-100 rounded w-full sm:w-40"
          value={completionRange}
          onChange={(e) => setCompletionRange(e.target.value)}
        >
          <option value="">All Completion</option>
          <option value="10-30">10% - 30%</option>
          <option value="30-60">30% - 60%</option>
          <option value="60-100">60% - 100%</option>
        </select>

        <input
          type="date"
          className="border p-2 bg-gray-100 rounded w-full sm:w-40"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow rounded text-xs sm:text-sm">
          <thead className="hidden sm:table-header-group">
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
              <tr
                key={t._id}
                className="border-b hover:bg-gray-50 flex flex-col sm:table-row mb-4 sm:mb-0 rounded sm:rounded-none shadow sm:shadow-none sm:border-none"
              >
                <td className="p-2 sm:table-cell">
                  <span className="sm:hidden font-semibold">Employee: </span>
                  {t.employee?.name ?? "-"}
                </td>
                <td className="p-2 sm:table-cell">
                  <span className="sm:hidden font-semibold">Title: </span>
                  {t.title}
                </td>
                <td className="p-2 sm:table-cell">
                  <span className="sm:hidden font-semibold">Description: </span>
                  {t.description}
                </td>
                <td className="p-2 sm:table-cell">
                  <span className="sm:hidden font-semibold">Start: </span>
                  {t.startTime}
                </td>
                <td className="p-2 sm:table-cell">
                  <span className="sm:hidden font-semibold">End: </span>
                  {t.endTime}
                </td>
                <td className="p-2 sm:table-cell">
                  <span className="sm:hidden font-semibold">Date: </span>
                  {formatDate(t.taskDate)}
                </td>
                <td className="p-2 sm:table-cell">
                  <span className="sm:hidden font-semibold">Org: </span>
                  {t.organization}
                </td>
                <td className="p-2 sm:table-cell">
                  <span className="sm:hidden font-semibold">Priority: </span>
                  {t.priority}
                </td>
                <td className="p-2 sm:table-cell">
                  <span className="sm:hidden font-semibold">Completion: </span>
                  {t.completion ?? 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
