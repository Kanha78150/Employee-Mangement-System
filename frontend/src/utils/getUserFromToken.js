import { jwtDecode } from "jwt-decode";

export default function getUserFromToken(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}
