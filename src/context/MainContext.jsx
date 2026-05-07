import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser as logoutUserService,
} from "../services/auth/authServices";

const MainContext = createContext(null);



export const MainProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isHomeLoading,setIsHomeLoading]=useState(true)
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated,setIsAuthenticated]=useState(false) 

const dynamicPath = useCallback((path = "") => {
  const role = user?.role || "user";
  const cleanPath = path.replace(/^\/+/, "");
  return `/${role}/${cleanPath}`.replace(/\/+$/, "");
}, [user?.role]);

  const login = async ({ phone, password }) => {
    try {
      const res = await loginUser({ phone, password });
      const token = res?.data?.token;
     
      if (!token) {
        throw new Error("Token not received");
      }
      localStorage.setItem("token", token);
      return res;
    } catch (error) {
      throw error
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
      setIsHomeLoading(false);
      return;
    }
 
    try {
      setIsHomeLoading(true);
      setAuthError(null);

      const res = await getCurrentUser();
      if(res?.status){
        setIsAuthenticated(true)
        setUser(res?.data?.user)

      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      setAuthError(null);
    } finally {
      setIsHomeLoading(false);
    }
  };



  const value = {
    user,
    setUser,
    authLoading,
    authError,
    login,
    logout,
    fetchCurrentUser,
    isAuthenticated,setIsAuthenticated,
    isHomeLoading,setIsHomeLoading,dynamicPath
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
