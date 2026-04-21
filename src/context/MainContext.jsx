import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser as logoutUserService,
} from "../services/auth/authServices";

const MainContext = createContext(null);



export const MainProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const login = async ({ phone, password }) => {
    try {
      setAuthLoading(true);
      setAuthError(null);

      const data = await loginUser({ phone, password });
      const token = data?.token;
      const loggedInUser = data?.user || null;

      if (!token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", token);
      setUser(loggedInUser);
      return data;
    } catch (error) {
      setAuthError(error?.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUserService();
    } catch (error) {
      // Ignore API logout failure and still clear local auth.
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setAuthError(null);
    }
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setAuthError(null);
      setAuthLoading(false);
      return;
    }

    try {
      setAuthLoading(true);
      setAuthError(null);

      const data = await getCurrentUser();
      setUser(data?.user || null);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      setAuthError(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = {
    user,
    setUser,
    authLoading,
    authError,
    login,
    logout,
    fetchCurrentUser,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMain = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMain must be used inside MainProvider");
  }
  return context;
};
