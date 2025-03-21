import React, { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setAuth({ token, user: decodedUser });
      } catch (error) {
        console.error("Token decode error:", error);
        localStorage.removeItem("token");
        setAuth({ token: null, user: null });
      }
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      try {
        const decodedUser = jwtDecode(data.token);
        setAuth({ token: data.token, user: decodedUser });
      } catch (error) {
        console.error("Token decode error:", error);
        setAuth({ token: data.token, user: null });
      }
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
