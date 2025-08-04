import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import Loader from "../UI/Loader";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await api.get("/analytics")).data,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Total Employees</h3>
          <p>{data.totalEmployees}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Total Tasks</h3>
          <p>{data.totalTasks}</p>
        </div>
      </div>
    </div>
  );
}
