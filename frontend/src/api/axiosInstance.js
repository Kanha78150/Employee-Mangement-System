import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 second timeout
});

// Request interceptor to include auth token and add request ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Show success message if provided by backend
    if (
      response.data?.success &&
      response.data?.message &&
      response.config.method !== "get"
    ) {
      toast.success(response.data.message);
    }

    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400: {
          // Bad request - show specific error message
          toast.error(
            data?.message || "Invalid request. Please check your input."
          );
          break;
        }

        case 401: {
          // Unauthorized - redirect to login
          if (window.location.pathname !== "/login") {
            localStorage.removeItem("token");
            toast.error(
              data?.message || "Session expired. Please login again."
            );
            window.location.href = "/login";
          } else {
            toast.error(
              data?.message || "Invalid credentials. Please try again."
            );
          }
          break;
        }

        case 403: {
          toast.error(
            data?.message ||
              "Access denied. You don't have permission to perform this action."
          );
          break;
        }

        case 404: {
          toast.error(data?.message || "Resource not found.");
          break;
        }

        case 429: {
          toast.error("Too many requests. Please try again later.");
          break;
        }

        case 500: {
          toast.error(data?.message || "Server error. Please try again later.");
          break;
        }

        default: {
          // Use server error message if available
          const errorMessage =
            data?.error?.message ||
            data?.message ||
            "An unexpected error occurred";
          toast.error(errorMessage);
          break;
        }
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection and try again.");
    } else {
      // Other error
      toast.error("An unexpected error occurred. Please try again.");
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors consistently
export const handleApiError = (error, customMessage) => {
  if (customMessage) {
    toast.error(customMessage);
  }

  // Error logging removed for production

  return error.response?.data || { message: "An unexpected error occurred" };
};

export default api;
