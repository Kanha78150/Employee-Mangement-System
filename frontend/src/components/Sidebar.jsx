import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-100 w-48 min-h-screen p-4">
      {user?.role === "admin" && (
        <>
          <Link className="block p-2 hover:bg-gray-200" to="/dashboard">
            Dashboard
          </Link>
          <Link className="block p-2 hover:bg-gray-200" to="/employees">
            Employees
          </Link>
          <Link className="block p-2 hover:bg-gray-200" to="/tasks">
            Tasks
          </Link>
          <Link className="block p-2 hover:bg-gray-200" to="/analytics">
            Analytics
          </Link>
        </>
      )}

      {user?.role === "employee" && (
        <Link className="block p-2 hover:bg-gray-200" to="/employee/tasks">
          My Tasks
        </Link>
      )}
    </div>
  );
}
