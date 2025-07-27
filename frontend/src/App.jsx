import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import EmployeeTasks from "./pages/EmployeeTasks";
import Analytics from "./pages/Analytics";

export default function App() {
  const { user } = useAuth();
  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex">
      {user && <Sidebar />}
      <div className="flex-1">
        {user && <Navbar />}
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Tasks />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeTasks />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/employee/tasks" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
}
