import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import Loader from "../UI/Loader";
import { FaAddressBook } from "react-icons/fa";
import { SiGoogletasks } from "react-icons/si";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await api.get("/analytics")).data,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 sm:text-3xl md:text-4xl lg:text-5xl">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 text-justify mb-4 sm:text-base md:text-lg lg:text-xl ">
          Here you can manage employees, assign tasks, and track progress.{" "}
          <br /> Use the dashboard below to view key metrics.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employees Card */}
        <div className="relative p-6 bg-white shadow rounded overflow-hidden">
          <FaAddressBook className="absolute text-gray-200 text-[105px] right-4 bottom-2 pointer-events-none" />
          <h3 className="text-2xl font-bold relative z-10">Total Employees</h3>
          <p className="text-xl font-semibold mt-2 relative z-10">
            {data.totalEmployees}
          </p>
        </div>

        {/* Tasks Card */}
        <div className="relative p-6 bg-white shadow rounded overflow-hidden">
          <SiGoogletasks className="absolute text-gray-200 text-[115px] right-4 bottom-0 pointer-events-none" />
          <h3 className="text-2xl font-bold relative z-10">Total Tasks</h3>
          <p className="text-xl font-semibold mt-2 relative z-10">
            {data.totalTasks}
          </p>
        </div>
      </div>
    </div>
  );
}
