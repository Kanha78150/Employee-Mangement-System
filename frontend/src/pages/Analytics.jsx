import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await api.get("/analytics")).data,
  });

  if (isLoading) return <div className="p-4">Loading analytics...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-2xl">{data.totalEmployees}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">Total Tasks</h3>
          <p className="text-2xl">{data.totalTasks}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">Completed Tasks</h3>
          <p className="text-2xl text-green-600">{data.completedTasks}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">Ongoing Tasks</h3>
          <p className="text-2xl text-blue-600">{data.ongoingTasks}</p>
        </div>
      </div>
    </div>
  );
}
