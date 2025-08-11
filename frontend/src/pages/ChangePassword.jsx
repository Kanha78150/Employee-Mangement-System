import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { TbLockPassword } from "react-icons/tb";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdSecurity } from "react-icons/md";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Check if user has permission to access this page
  useEffect(() => {
    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken) {
      toast.error("Unauthorized access. Please login first.");
      navigate("/login");
      return;
    }

    // Set the temporary token for the API call
    api.defaults.headers.common["Authorization"] = `Bearer ${tempToken}`;
  }, [navigate]);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const newErrors = {};

    if (!form.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!form.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordValidation = validatePassword(form.newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = "Password does not meet requirements";
      }
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await api.put("/auth/admin/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      toast.success(
        "Password changed successfully! Please login with your new password."
      );

      // ✅ Clean up temporary token and logout
      localStorage.removeItem("tempToken");
      delete api.defaults.headers.common["Authorization"];
      logout();
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);

      if (errorMessage.includes("Current password is incorrect")) {
        setErrors({ currentPassword: "Current password is incorrect" });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const passwordValidation = validatePassword(form.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <MdSecurity className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Change Password Required
          </h1>
          <p className="text-gray-600">
            For security reasons, you must change your password before
            continuing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <TbLockPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.currentPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <TbLockPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}

            {/* Password Requirements */}
            {form.newPassword && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-gray-700">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div
                    className={`flex items-center ${
                      passwordValidation.minLength
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.minLength ? "✓" : "✗"}
                    </span>
                    8+ characters
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasUpper
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasUpper ? "✓" : "✗"}
                    </span>
                    Uppercase
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasLower
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasLower ? "✓" : "✗"}
                    </span>
                    Lowercase
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasNumber
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasNumber ? "✓" : "✗"}
                    </span>
                    Number
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordValidation.hasSpecial
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span className="mr-1">
                      {passwordValidation.hasSpecial ? "✓" : "✗"}
                    </span>
                    Special char
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <TbLockPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordValidation.isValid}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              loading || !passwordValidation.isValid
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> After changing your password, you will be
            logged out and need to login again with your new password.
          </p>
        </div>
      </div>
    </div>
  );
}
