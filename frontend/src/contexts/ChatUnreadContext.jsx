import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import socketService from "../services/socket";

const ChatUnreadContext = createContext();

export const useChatUnread = () => {
  const context = useContext(ChatUnreadContext);
  if (!context) {
    throw new Error("useChatUnread must be used within ChatUnreadProvider");
  }
  return context;
};

export const ChatUnreadProvider = ({ children }) => {
  const [totalUnread, setTotalUnread] = useState(0);
  const [chatCounts, setChatCounts] = useState({});

  const fetchUnreadCounts = async () => {
    try {
      console.log("[DEBUG] ChatUnreadContext - Fetching unread counts...");
      const res = await axiosInstance.get("/team-chat/unread-count");
      console.log("[DEBUG] ChatUnreadContext - API response:", res.data);
      setTotalUnread(res.data.totalUnread || 0);
      setChatCounts(res.data.chatCounts || {});
      console.log("[DEBUG] ChatUnreadContext - Set totalUnread:", res.data.totalUnread, "chatCounts:", res.data.chatCounts);
    } catch (err) {
      console.error("Fetch unread counts error:", err);
    }
  };

  useEffect(() => {
    // Only fetch if user is authenticated (token exists)
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("[ChatUnreadContext] No token found, skipping initial fetch");
      return;
    }

    // Initial fetch
    fetchUnreadCounts();

    // Socket.IO event listeners for real-time updates
    const socket = socketService.getSocket();
    console.log("[ChatUnreadContext] Socket check:", socket ? "EXISTS" : "MISSING", socket ? (socket.connected ? "CONNECTED" : "NOT CONNECTED") : "");
    if (socket) {
      console.log("[ChatUnreadContext] Setting up socket event listeners");
      const handleNewMessage = (data) => {
        console.log("[ChatUnreadContext] New message received, updating unread count");
        // Increment unread count for the sender
        setChatCounts((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1,
        }));
        setTotalUnread((prev) => prev + 1);
      };

      const handleUnreadUpdate = (data) => {
        console.log("[ChatUnreadContext] Unread count update received:", data);
        setTotalUnread(data.totalUnread || 0);
        setChatCounts(data.chatCounts || {});
      };

      socket.on("newMessage", handleNewMessage);
      socket.on("unreadUpdate", handleUnreadUpdate);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("unreadUpdate", handleUnreadUpdate);
      };
    }
  }, []);

  return (
    <ChatUnreadContext.Provider value={{ totalUnread, chatCounts, fetchUnreadCounts }}>
      {children}
    </ChatUnreadContext.Provider>
  );
};
