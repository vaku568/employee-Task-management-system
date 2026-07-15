import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import socketService from "../services/socket";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log("[DEBUG] NotificationContext - Fetching notifications...");
      const res = await axiosInstance.get("/notifications");
      console.log("[DEBUG] NotificationContext - API response:", res.data);
      console.log("[DEBUG] NotificationContext - Response length:", res.data?.length);
      console.log("[DEBUG] NotificationContext - Setting notifications state with", res.data?.length, "items");
      setNotifications(res.data);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axiosInstance.get("/notifications/unread-count");
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Fetch unread count error:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/notifications/read-all");
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
      const deletedNotif = notifications.find((n) => n._id === notificationId);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  useEffect(() => {
    // Only fetch if user is authenticated (token exists)
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("[NotificationContext] No token found, skipping initial fetch");
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchNotifications();
    fetchUnreadCount();

    // Socket.IO event listeners for real-time updates
    const socket = socketService.getSocket();
    console.log("[NotificationContext] Socket check:", socket ? "EXISTS" : "MISSING", socket ? (socket.connected ? "CONNECTED" : "NOT CONNECTED") : "");
    if (socket) {
      console.log("[NotificationContext] Setting up socket event listeners");
      const handleNewNotification = (data) => {
        console.log("[NotificationContext] New notification received:", data);
        console.log("[NotificationContext] Current notifications count before update:", notifications.length);
        setNotifications((prev) => {
          const updated = [data, ...prev];
          console.log("[NotificationContext] Notifications count after update:", updated.length);
          return updated;
        });
        setUnreadCount((prev) => {
          const updated = prev + 1;
          console.log("[NotificationContext] Unread count updated from", prev, "to", updated);
          return updated;
        });
        
        // Show snackbar for new notification
        setSnackbar({
          open: true,
          severity: "info",
          message: data.title,
        });
      };

      const handleNotificationRead = (data) => {
        console.log("[NotificationContext] Notification read:", data);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === data.notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      };

      socket.on("newNotification", handleNewNotification);
      socket.on("notification:read", handleNotificationRead);

      return () => {
        socket.off("newNotification", handleNewNotification);
        socket.off("notification:read", handleNotificationRead);
      };
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        snackbar,
        setSnackbar,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
