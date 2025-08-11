import { jwtDecode } from "jwt-decode";

export default function getUserFromToken(token) {
  // ✅ Check if token exists and is a string
  if (!token || typeof token !== "string") {
    console.warn("Invalid token provided to getUserFromToken:", token);
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
