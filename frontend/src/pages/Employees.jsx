import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import Loader from "../UI/Loader";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export default function Employees() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "Technical",
    role: "employee",
    image: null,
    date_of_birth: "",
    date_of_joining: new Date().toISOString().split("T")[0], // Set default to today
    gender: "",
  });

  // State to track which employee is being edited
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch employees
  const { data, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const response = await api.get("/employees");
        // console.log("Fetched employees:", response.data);
        return response.data;
      } catch (error) {
        // console.error("Fetch error:", error);
        toast.error("Failed to fetch employees: " + error.message);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always fetch fresh data
  });

  // Create employee mutation
  const createEmployee = useMutation({
    mutationFn: async (newEmp) => {
      try {
        const response = await api.post("/employees", newEmp);
        return response.data;
      } catch (error) {
        // Throw a more user-friendly error
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    onSuccess: () => {
      // alert("Employee created successfully!");
      toast.success("Employee created successfully!");
      queryClient.invalidateQueries(["employees"]);
      setForm({
        name: "",
        email: "",
        password: "",
        department: "Technical",
        role: "employee",
        image: null,
        date_of_birth: "",
        date_of_joining: new Date().toISOString().split("T")[0],
        gender: "",
      });
    },
    onError: (error) => {
      // console.error("Create failed:", error);
      // alert("Failed to create employee: " + error.message);
      toast.error("Failed to create employee: " + error.message);
    },
  });

  // Update employee mutation
  const updateEmployee = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        // console.log("Updating employee:", id);
        // console.log(data);

        data.delete("employeeId");

        // console.log("Update data:", Object.fromEntries(data.entries()));

        const response = await api.put(`/employees/${id}`, data);
        // console.log("Update response:", response.data);
        return response.data;
      } catch (error) {
        // console.error("Update error:", error);
        toast.error("Failed to update employee: " + error.message);
        throw error;
      }
    },
    onSuccess: (data) => {
      // console.log("Update successful:", data);
      // alert("Employee updated successfully!");
      toast.success("Employee updated successfully!");
      // Force refetch
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // Reset form
      setEditingEmployee(null);
      setForm({
        name: "",
        email: "",
        password: "",
        department: "Technical",
        role: "employee",
        image: null,
        date_of_birth: "",
        date_of_joining: new Date().toISOString().split("T")[0],
        gender: "",
      });
    },
    onError: (error) => {
      toast.error("Failed to update employee: " + error.message);
    },
  });

  // Delete employee mutation
  const deleteEmployee = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
      } catch (error) {
        console.error("Delete error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // alert("Employee permanently deleted from database!");
      toast.success("Employee permanently deleted from database!");
      queryClient.invalidateQueries(["employees"]); // Refresh the employee list
    },
    onError: (error) => {
      // console.error("Delete failed:", error);
      // alert("Failed to delete employee: " + error.message);
      toast.error("Failed to delete employee: " + error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp._id);
    setForm({
      name: emp.name,
      email: emp.email,
      password: "", // Don't set the password
      department: emp.department,
      role: emp.role,
      image: null,
      date_of_birth: emp.date_of_birth?.split("T")[0] || "",
      date_of_joining: emp.date_of_joining?.split("T")[0] || "",
      gender: emp.gender,
    });
  };

  const handleDelete = (empId) => {
    if (
      toast.success(
        "Employee Deleted Successfully! This action cannot be undone."
      ) &&
      window.confirm(
        "Are you sure you want to permanently delete this employee? This action cannot be undone!"
      )
    ) {
      deleteEmployee.mutate(empId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = {
      name: "Name",
      email: "Email",
      password: !editingEmployee ? "Password" : null,
      department: "Department",
      date_of_birth: "Date of Birth",
      date_of_joining: "Date of Joining",
      gender: "Gender",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, label]) => label && !form[key])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    const formData = new FormData();

    // Add all form fields to formData with proper date formatting
    Object.entries(form).forEach(([key, value]) => {
      if (key === "image") {
        if (value instanceof File) {
          formData.append("image", value);
        }
      } else if (key === "date_of_birth" || key === "date_of_joining") {
        // Ensure dates are in proper ISO format
        if (value) {
          formData.append(key, new Date(value).toISOString());
        }
      } else if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    // Log the data being sent
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      if (editingEmployee) {
        updateEmployee.mutate({
          id: editingEmployee,
          data: formData,
        });
      } else {
        createEmployee.mutate(formData);
      }
    } catch (error) {
      // console.error("Form submission error:", error);
      // alert("Error submitting form: " + error.message)
      toast.error("Error submitting form: " + error.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!data?.employees) return <div className="p-4">No employees found</div>;

  return (
    <div className="p-4 overflow-auto h-screen">
      <h2 className="text-xl font-bold mb-4">Employees</h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg mb-8 border border-blue-200"
      >
        <h3 className="text-2xl font-bold mb-6 text-blue-700">
          {editingEmployee ? "Edit Employee" : "Create Employee"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <input
              className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>
            <input
              className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder={
                editingEmployee
                  ? "Leave blank to keep current password"
                  : "Password"
              }
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!editingEmployee}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Department
            </label>
            <select
              className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              <option>Technical</option>
              <option>Non-technical</option>
              <option>Support</option>
              <option>HR</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
              className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Date of Joining
            </label>
            <input
              type="date"
              placeholder="Date of Joining"
              name="date_of_joining"
              value={form.date_of_joining}
              onChange={handleChange}
              required
              className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={handleChange}
            />
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 mt-8 rounded-lg font-semibold shadow transition w-full md:w-auto">
          {editingEmployee ? "Update Employee" : "Create Employee"}
        </button>
        {editingEmployee && (
          <button
            type="button"
            onClick={() => {
              setEditingEmployee(null);
              setForm({
                name: "",
                employeeId: "",
                email: "",
                password: "",
                department: "Technical",
                role: "employee",
                image: null,
                date_of_birth: "",
                date_of_joining: new Date().toISOString().split("T")[0],
                gender: "",
              });
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 mt-8 rounded-lg font-semibold shadow transition ml-4"
          >
            Cancel
          </button>
        )}
      </form>

      <h3 className="text-lg font-semibold mb-2">Employee List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Image
              </th>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Name
              </th>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Employee ID
              </th>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Email
              </th>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Department
              </th>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Role
              </th>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Date of Birth
              </th>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Date of Joining
              </th>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Gender
              </th>
              <th className="p-3 font-semibold text-sm whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.employees?.map((emp) => (
              <tr
                key={emp._id}
                className="hover:bg-blue-50 border-b transition"
              >
                <td className="p-3 text-sm">
                  {emp.image ? (
                    <img
                      src={`${backendUrl}${emp.image}`}
                      alt={emp.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3 text-sm">{emp.name}</td>
                <td className="p-3 text-sm">{emp.employeeId}</td>
                <td className="p-3 text-sm">{emp.email}</td>
                <td className="p-3 text-sm">{emp.department}</td>
                <td className="p-3 text-sm">{emp.role}</td>
                <td className="p-3 text-sm">{formatDate(emp.date_of_birth)}</td>
                <td className="p-3 text-sm">
                  {formatDate(emp.date_of_joining)}
                </td>
                <td className="p-3 text-sm">{emp.gender || "-"}</td>
                <td className="p-3 text-sm flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
