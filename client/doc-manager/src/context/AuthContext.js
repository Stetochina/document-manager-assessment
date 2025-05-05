import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Token ${token}`;
    }
  }, [token]);

  const login = (authToken, userId) => {
    setToken(authToken);
    localStorage.setItem("token", authToken);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Token ${authToken}`;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
