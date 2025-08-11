import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import EmployeeTasks from "./pages/EmployeeTasks";
import Analytics from "./pages/Analytics";
import ChangePassword from "./pages/ChangePassword";

export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  const showLayout = user && location.pathname !== "/login";

  return (
    <ErrorBoundary>
      <div className="flex">
        {showLayout && <Sidebar />}
        <div className="flex-1">
          {showLayout && <Navbar />}
          <Routes>
            {/* Login Route */}
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate
                    to={
                      user.role === "admin" ? "/dashboard" : "/employee/tasks"
                    }
                    replace
                  />
                ) : (
                  <Login />
                )
              }
            />

            {/* Change Password Route - No authentication required */}
            <Route path="/change-password" element={<ChangePassword />} />

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
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            {/* Employee Route */}
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
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
}
