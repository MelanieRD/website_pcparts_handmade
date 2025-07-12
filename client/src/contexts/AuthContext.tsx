import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { apiService } from "../services/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthContext - Initializing auth, token from localStorage:", token);
      if (token) {
        try {
          // Verify token by getting current user
          console.log("AuthContext - Verifying token:", token);
          const currentUser = await apiService.getCurrentUser(token);
          console.log("AuthContext - Current user:", currentUser);
          setUser(currentUser);
        } catch (error) {
          console.error("Token validation failed:", error);
          // Try to refresh the token if it's expired
          try {
            console.log("AuthContext - Attempting to refresh token");
            const refreshResponse = await apiService.refreshToken(token);
            setUser(refreshResponse.user);
            setToken(refreshResponse.token);
            localStorage.setItem("token", refreshResponse.token);
            console.log("AuthContext - Token refreshed successfully");
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      console.log("AuthContext - Login response:", response);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      console.log("AuthContext - Token saved to localStorage:", response.token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.register(email, password, name);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
