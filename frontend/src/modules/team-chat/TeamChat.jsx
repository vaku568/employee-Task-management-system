import { useEffect, useState, useRef, useCallback } from "react";
import { Box, CircularProgress, Alert, Snackbar } from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import socketService from "../../services/socket";
import TeamLeadLayout from "../../layouts/TeamLeadLayout";
import PageHeader from "../../components/layout/PageHeader";
import GlassContainer from "../../components/layout/GlassContainer";
import UserList from "../../components/team-chat/TeamLeadList";
import ChatWindow from "../../components/team-chat/ChatWindow";

const TeamChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [unreadCounts, setUnreadCounts] = useState({});
  const pollIntervalRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user")) || null;

  // Fetch all users for chat
  const fetchUsers = useCallback(async () => {
    try {
      console.log("[DEBUG] fetchUsers - Calling API: /team-chat/users");
      const res = await axiosInstance.get("/team-chat/users");
      console.log("[DEBUG] fetchUsers - API Response:", res.data);
      console.log("[DEBUG] fetchUsers - Number of users received:", res.data.length);
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers([]);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to load users",
      });
    }
  }, []);

  // Fetch unread counts
  const fetchUnreadCounts = useCallback(async () => {
    try {
      console.log("[DEBUG] fetchUnreadCounts - Calling API: /team-chat/unread-count");
      const res = await axiosInstance.get("/team-chat/unread-count");
      console.log("[DEBUG] fetchUnreadCounts - API Response:", res.data);
      setUnreadCounts(res.data.chatCounts || {});
    } catch (err) {
      console.error("Fetch unread counts error:", err);
    }
  }, []);

  // Fetch conversation with selected user
  const fetchConversation = useCallback(async (userId) => {
    try {
      const res = await axiosInstance.get(`/team-chat/conversation/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to load conversation",
      });
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUsers();
      await fetchUnreadCounts();
      setLoading(false);
    };
    loadData();
  }, [fetchUsers, fetchUnreadCounts]);

  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    const socket = socketService.getSocket();
    console.log("[DEBUG] TeamChat - Socket check:", socket ? "EXISTS" : "MISSING", socket ? (socket.connected ? "CONNECTED" : "NOT CONNECTED") : "");
    if (!socket) {
      console.warn("[DEBUG] TeamChat - Socket not available, cannot set up listeners");
      return;
    }

    console.log("[DEBUG] TeamChat - Setting up socket event listeners");

    // Listen for new messages
    const handleNewMessage = (data) => {
      console.log("[DEBUG] TeamChat - Received new message via socket:", data);

      // If message is for current conversation, add it
      if (selectedUser && data.senderId === selectedUser._id) {
        console.log("[DEBUG] TeamChat - Message is for current conversation, adding to messages");
        setMessages((prev) => [...prev, data]);
      } else {
        console.log("[DEBUG] TeamChat - Message is NOT for current conversation (selectedUser:", selectedUser?._id, ", senderId:", data.senderId, ")");
      }

      // Update unread counts
      if (data.senderId !== currentUser?._id) {
        console.log("[DEBUG] TeamChat - Incrementing unread count for sender:", data.senderId);
        setUnreadCounts((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1,
        }));
      }
    };

    // Listen for message sent confirmation
    const handleMessageSent = (data) => {
      console.log("[DEBUG] Message sent confirmation:", data);
      // Refresh conversation to get the saved message from database
      if (selectedUser) {
        fetchConversation(selectedUser._id);
      }
    };

    // Listen for unread count updates
    const handleUnreadUpdate = (data) => {
      console.log("[DEBUG] Unread count update:", data);
      setUnreadCounts(data.chatCounts || {});
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSent", handleMessageSent);
    socket.on("unreadUpdate", handleUnreadUpdate);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSent", handleMessageSent);
      socket.off("unreadUpdate", handleUnreadUpdate);
    };
  }, [selectedUser, currentUser, fetchConversation]);

  // Poll for unread counts as fallback (reduced frequency)
  useEffect(() => {
    pollIntervalRef.current = setInterval(async () => {
      await fetchUnreadCounts();
    }, 10000); // Reduced to 10 seconds as fallback

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchUnreadCounts]);

  // Handle user selection
  const handleSelectUser = useCallback((user) => {
    setSelectedUser(user);
    setMessages([]);
    fetchConversation(user._id);
  }, [fetchConversation]);

  // Handle sending message
  const handleSendMessage = useCallback(async (message, files) => {
    if (!selectedUser) return;

    try {
      const formData = new FormData();
      formData.append("message", message);
      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await axiosInstance.post(
        `/team-chat/${selectedUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Emit socket event for real-time delivery
      const socket = socketService.getSocket();
      if (socket) {
        socket.emit("sendMessage", {
          receiverId: selectedUser._id,
          message,
          files: res.data.files || [],
        });
      }

      setMessages((prev) => [...prev, res.data]);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to send message",
      });
    }
  }, [selectedUser, fetchUsers]);

  // Mark messages as read
  const handleMarkRead = useCallback(async () => {
    if (!selectedUser) return;

    try {
      await axiosInstance.put(`/team-chat/read/${selectedUser._id}`);
      await fetchUnreadCounts();
    } catch (err) {
      console.error(err);
    }
  }, [selectedUser, fetchUnreadCounts]);

  return (
    <TeamLeadLayout pageTitle="Team Chat">
      <PageHeader
        title="Team Chat"
        subtitle="Communicate with your team members"
      />

      <GlassContainer
        sx={{
          height: "calc(100vh - 200px)",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* User List - 30% */}
            <UserList
              users={users}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser}
              currentUser={currentUser}
              unreadCounts={unreadCounts}
            />

            {/* Chat Window - 70% */}
            <ChatWindow
              selectedEmployee={selectedUser}
              messages={messages}
              onSendMessage={handleSendMessage}
              onMarkRead={handleMarkRead}
              currentUser={currentUser}
              isTeamLeadView={true}
            />
          </>
        )}
      </GlassContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </TeamLeadLayout>
  );
};

export default TeamChat;
