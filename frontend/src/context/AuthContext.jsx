import { createContext, useContext, useState } from "react";
import getUserFromToken from "../utils/getUserFromToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(token ? getUserFromToken(token) : null);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(getUserFromToken(newToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
