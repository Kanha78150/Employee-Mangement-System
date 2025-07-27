import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axiosInstance";

export default function Employees() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    email: "",
    password: "",
    department: "Technical",
    role: "employee",
  });

  // Fetch employees
  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => (await api.get("/employees")).data,
  });

  // Create employee mutation
  const createEmployee = useMutation({
    mutationFn: async (newEmp) => (await api.post("/employees", newEmp)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setForm({
        name: "",
        employeeId: "",
        email: "",
        password: "",
        department: "Technical",
        role: "employee",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createEmployee.mutate(form);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employees</h2>

      {/* Create Employee Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <h3 className="text-lg font-semibold mb-2">Create Employee</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="border p-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="border p-2"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          >
            <option>Technical</option>
            <option>Non-technical</option>
            <option>Support</option>
            <option>HR</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 mt-3 rounded">
          Create Employee
        </button>
      </form>

      {/* Employees Table */}
      <h3 className="text-lg font-semibold mb-2">Employee List</h3>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Employee ID</th>
            <th className="p-2">Department</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {data.employees.map((emp) => (
            <tr key={emp._id} className="border-b">
              <td className="p-2">{emp.name}</td>
              <td className="p-2">{emp.employeeId}</td>
              <td className="p-2">{emp.department}</td>
              <td className="p-2">{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
