import { jwtDecode } from "jwt-decode";

export default function getUserFromToken(token) {
  // ✅ Check if token exists and is a string
  if (!token || typeof token !== "string") {
    // Invalid token - logging removed for production
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    // JWT decode error - logging removed for production
    return null;
  }
}
