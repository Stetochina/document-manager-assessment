import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_id");
    return savedUser ? { user_id: JSON.parse(savedUser) } : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Token ${token}`;
    }
  }, [token]);

  const login = (authToken, userId) => {
    setUser({ user_id: userId });
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user_id", JSON.stringify(userId));
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Token ${authToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
