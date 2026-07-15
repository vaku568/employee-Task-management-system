import { createContext, useState, useEffect } from "react";
import socketService from "../services/socket";
import axiosInstance from "../services/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Restore user after page refresh - always fetch fresh data
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });
  const [loading, setLoading] = useState(true);

  // Fetch fresh user data on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await axiosInstance.get("/auth/me");
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error("Failed to fetch current user:", error);
          // Do NOT clear localStorage - keep the token for the user to try again
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  // Initialize socket when user is authenticated
  useEffect(() => {
    console.log("[DEBUG] AuthContext - Socket init check - token:", token ? "EXISTS" : "MISSING", "user:", user ? JSON.stringify({ id: user._id, role: user.role }) : "MISSING");

    if (token && user) {
      console.log("[DEBUG] AuthContext - Initializing socket for user:", user._id, "role:", user.role);
      socketService.initializeSocket(token);
    }

    return () => {
      // Cleanup on unmount
      console.log("[DEBUG] AuthContext - Disconnecting socket on cleanup");
      socketService.disconnectSocket();
    };
  }, [token, user]);

  // Login
  const login = (token, userData) => {
    // Clear old authentication data first
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("unreadCount");
    localStorage.removeItem("notificationCount");
    sessionStorage.clear();

    // Save new authentication data
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(token);
    setUser(userData);

    // Initialize socket after login
    socketService.initializeSocket(token);
  };

  // Logout - Complete cleanup
  const logout = () => {
    // Disconnect socket
    socketService.disconnectSocket();

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Clear any other authentication/session data
    localStorage.removeItem("unreadCount");
    localStorage.removeItem("notificationCount");

    // Clear sessionStorage
    sessionStorage.clear();

    // Reset user state
    setToken(null);
    setUser(null);

    // Clear any cached application state
    // (Additional items can be added as needed)
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};