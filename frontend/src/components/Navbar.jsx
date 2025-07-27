import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">Employee Dashboard</h1>
      <div>
        {user && (
          <span className="mr-4">
            Logged in as: <strong>{user.role}</strong>
          </span>
        )}
        <button className="bg-red-500 px-3 py-1 rounded" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
