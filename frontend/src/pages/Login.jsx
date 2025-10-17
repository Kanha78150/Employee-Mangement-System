import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { FiLogIn } from "react-icons/fi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    employeeId: "",
    password: "",
    type: "admin",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (form.type === "admin") {
        res = await api.post(
          "/auth/admin",
          {
            email: form.email,
            password: form.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // ✅ Check if admin needs to change password on first login
        if (res.data.isFirstLogin) {
          // Store token temporarily for password change
          localStorage.setItem("tempToken", res.data.token);
          toast.warning(res.data.message || "Please change your password");
          navigate("/change-password");
          return;
        }
      } else {
        res = await api.post("/auth/employee", {
          employeeId: form.employeeId,
          password: form.password,
        });
      }

      // ✅ Extract token from response
      let token;
      if (form.type === "admin") {
        token = res.data.token;
      } else {
        // Employee response: { success: true, token: { token: "..." } } or { token: "..." }
        if (res.data && res.data.token && typeof res.data.token === "string") {
          token = res.data.token;
        } else if (
          res.data &&
          typeof res.data.token === "object" &&
          res.data.token.token
        ) {
          token = res.data.token.token;
        } else {
          toast.error("Login failed: Invalid response format");
          return;
        }
      }

      // ✅ Ensure token is a string
      if (typeof token !== "string") {
        toast.error("Login failed: Invalid token format");
        return;
      }

      // ✅ Normal login flow
      login(token);
      // Success message will be shown by axios interceptor
    } catch {
      // Error will be handled by axios interceptor
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <FiLogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20"
        >
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Login As
            </label>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "admin" })}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  form.type === "admin"
                    ? "bg-white text-blue-600 shadow-md transform scale-105"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CgProfile className="w-4 h-4" />
                  <span>Admin</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "employee" })}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  form.type === "employee"
                    ? "bg-white text-blue-600 shadow-md transform scale-105"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CgProfile className="w-4 h-4" />
                  <span>Employee</span>
                </div>
              </button>
            </div>
          </div>

          {/* Admin Fields */}
          {form.type === "admin" ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdOutlineAlternateEmail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TbLockPassword className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Employee Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CgProfile className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your employee ID"
                    value={form.employeeId}
                    onChange={(e) =>
                      setForm({ ...form, employeeId: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TbLockPassword className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <FiLogIn className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
