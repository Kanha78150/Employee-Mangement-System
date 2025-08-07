import { useState } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { FiLogIn } from "react-icons/fi";

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
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 overflow-y-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-sm md:max-w-lg lg:max-w-xl bg-white p-6 sm:p-4 md:p-6 lg:p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center">
          Sign In to your Account
        </h2>

        {/* Role Selection */}
        <div className="mb-4">
          <label className="block text-base font-semibold mb-2">Login As</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border border-gray-300 p-2 w-full rounded outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        {/* Admin Fields */}
        {form.type === "admin" ? (
          <>
            <div className="flex items-center border border-gray-300 p-2 mb-4 rounded">
              <MdOutlineAlternateEmail className="text-xl text-gray-600" />
              <input
                className="w-full ml-2 outline-none py-1"
                placeholder="Admin Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="flex items-center border border-gray-300 p-2 mb-4 rounded">
              <TbLockPassword className="text-xl text-gray-600" />
              <input
                className="w-full ml-2 outline-none"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </>
        ) : (
          <>
            {/* Employee Fields */}
            <div className="flex items-center border border-gray-300 p-2 mb-4 rounded">
              <CgProfile className="text-xl text-gray-600" />
              <input
                className="w-full ml-2 outline-none"
                placeholder="Employee ID"
                value={form.employeeId}
                onChange={(e) =>
                  setForm({ ...form, employeeId: e.target.value })
                }
              />
            </div>

            <div className="flex items-center border border-gray-300 p-2 mb-4 rounded">
              <TbLockPassword className="text-xl text-gray-600" />
              <input
                className="w-full ml-2 outline-none"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded text-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 font-semibold"
        >
          <FiLogIn className="text-lg" />
          Sign In
        </button>
      </form>
    </div>
  );
}
