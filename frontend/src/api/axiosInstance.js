import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add an interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or however you store your token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
