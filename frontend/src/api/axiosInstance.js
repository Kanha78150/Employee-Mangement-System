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
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;

    // Log successful requests in development
    if (import.meta.env.VITE_NODE_ENV === "development") {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${
          response.status
        } (${duration}ms)`
      );
    }

    return response;
  },
  (error) => {
    // Calculate request duration if available
    const duration = error.config?.metadata
      ? new Date() - error.config.metadata.startTime
      : "unknown";

    // Log error details
    console.error(`❌ API Error (${duration}ms):`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (window.location.pathname !== "/login") {
            localStorage.removeItem("token");
            toast.error("Session expired. Please login again.");
            window.location.href = "/login";
          }
          break;

        case 403:
          toast.error(
            "Access denied. You don't have permission to perform this action."
          );
          break;

        case 404:
          toast.error("Resource not found.");
          break;

        case 429:
          toast.error("Too many requests. Please try again later.");
          break;

        case 500:
          toast.error("Server error. Please try again later.");
          break;

        default:
          // Use server error message if available
          const errorMessage =
            data?.error?.message ||
            data?.message ||
            "An unexpected error occurred";
          toast.error(errorMessage);
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

  // Log error for debugging
  console.error("API Error:", error);

  return error.response?.data || { message: "An unexpected error occurred" };
};

export default api;
