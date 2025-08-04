import { useState } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const { login } = useAuth();
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
      } else {
        res = await api.post("/auth/employee", {
          employeeId: form.employeeId,
          password: form.password,
        });
      }
      login(res.data.token);
      toast.success("Login successful!");
    } catch (err) {
      // alert(err.response?.data?.message || "Login failed")
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <div className="mb-3">
          <label className="block text-sm">Login As</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        {form.type === "admin" ? (
          <>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Admin Email"
              type="email" // Add this
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </>
        ) : (
          <>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Employee ID"
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
