import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import LoadingSpinner, { SkeletonTableRow } from "../components/LoadingSpinner";
import {
  FiEdit2,
  FiTrash2,
  FiUser,
  FiMail,
  FiCalendar,
  FiUsers,
  FiSearch,
  FiPlus,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "Technical",
    role: "employee",
    image: null,
    date_of_birth: "",
    date_of_joining: new Date().toISOString().split("T")[0],
    gender: "",
    contactNumber: "",
    designation: "", // This will be used for Position/Designation
    location: "",
  });

  const [editingEmployee, setEditingEmployee] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const response = await api.get("/employees");
        return response.data;
      } catch (error) {
        toast.error("Failed to fetch employees: " + error.message);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  const createEmployee = useMutation({
    mutationFn: async (newEmp) => {
      try {
        const response = await api.post("/employees", newEmp);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    onSuccess: () => {
      toast.success("Employee created successfully!");
      queryClient.invalidateQueries(["employees"]);
      setShowForm(false); // ✅ Close the form after successful creation
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
      toast.error("Failed to create employee: " + error.message);
    },
  });

  const updateEmployee = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        data.delete("employeeId");
        const response = await api.put(`/employees/${id}`, data);
        return response.data;
      } catch (error) {
        toast.error("Failed to update employee: " + error.message);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Employee updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditingEmployee(null);
      setShowForm(false); // ✅ Close the form after successful update
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

  const deleteEmployee = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
      } catch (error) {
        // Error handling removed for production
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Employee permanently deleted from database!");
      queryClient.invalidateQueries(["employees"]);
    },
    onError: (error) => {
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
    setShowForm(true);
    setForm({
      name: emp.name,
      email: emp.email,
      password: "",
      department: emp.department,
      role: emp.role,
      image: null,
      date_of_birth: emp.date_of_birth?.split("T")[0] || "",
      date_of_joining: emp.date_of_joining?.split("T")[0] || "",
      gender: emp.gender,
      contactNumber: emp.contactNumber || "",
      designation: emp.designation || "",
      location: emp.location || "",
    });
  };

  const handleDelete = (empId) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this employee? This action cannot be undone!"
      )
    ) {
      deleteEmployee.mutate(empId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      toast.error("Error submitting form: " + error.message);
    }
  };

  // Filter employees based on search term
  const filteredEmployees =
    data?.employees?.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(9)].map((_, i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <SkeletonTableRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-xl mb-2">
            ⚠️ Error Loading Employees
          </div>
          <p className="text-red-700">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data?.employees) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-600 text-xl mb-2">
            📋 No Employees Found
          </div>
          <p className="text-gray-500">Start by adding your first employee.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Employee Management
          </h1>
          <p className="text-gray-600">
            Manage your team members and their information
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FiUsers className="w-4 h-4" />
              <span>Total: {data?.employees?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiSearch className="w-4 h-4" />
              <span>Filtered: {filteredEmployees.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
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
                  contactNumber: "",
                  designation: "",
                  location: "",
                });
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-700">
              {editingEmployee ? "Edit Employee" : "Create Employee"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Name
                </label>
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
                  max={new Date().toISOString().split("T")[0]}
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

              {/* New Fields */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., +1 234 567 8900"
                  className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Position/Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Software Engineer, Manager, Team Lead"
                  className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., New York, Remote, Building A"
                  className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Role
                </label>
                <select
                  className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
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

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition w-full sm:w-auto cursor-pointer">
                {editingEmployee ? "Update Employee" : "Create Employee"}
              </button>
              {editingEmployee && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEmployee(null);
                    setShowForm(false); // ✅ Close the form when cancelled
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
                      contactNumber: "",
                      designation: "",
                      location: "",
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold shadow transition w-full sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Employee List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4" />
                    <span>Employee</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4" />
                    <span>Contact Info</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4" />
                    <span>Position & Department</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>Dates</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No employees found</p>
                      <p className="text-sm">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "Start by adding your first employee"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Employee Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {emp.image ? (
                            <img
                              src={`${backendUrl}${emp.image}`}
                              alt={emp.name}
                              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                              <FiUser className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {emp.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {emp.employeeId}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {emp.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <FiMail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {emp.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiPhone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {emp.contactNumber || "Not provided"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {emp.gender || "Not specified"}
                        </div>
                      </div>
                    </td>

                    {/* Position & Department */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {emp.designation || "Position not specified"}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {emp.department}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {emp.location || "Location not specified"}
                        </span>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          <span className="text-gray-500">Born:</span>{" "}
                          {formatDate(emp.date_of_birth)}
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="text-gray-500">Joined:</span>{" "}
                          {formatDate(emp.date_of_joining)}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="inline-flex items-center p-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          title="Edit Employee"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="inline-flex items-center p-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                          title="Delete Employee"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
