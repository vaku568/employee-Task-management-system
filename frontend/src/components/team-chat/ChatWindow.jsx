import { useEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Chip, Divider, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const ChatWindow = ({ selectedEmployee, messages, onSendMessage, onMarkRead, currentUser, isTeamLeadView = true }) => {
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString();
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const dateKey = formatMessageDate(msg.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const getTeamColor = (team) => {
    const teamColors = {
      "WRITING": "#1976D2",
      "GEN": "#43A047",
      "DB": "#FB8C00",
      "ML": "#8E24AA",
      "CYBER": "#00897B",
    };
    return teamColors[team] || "#42A5F5";
  };

  if (!selectedEmployee) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
          Select an employee to start chatting
        </Typography>
      </Box>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
          bgcolor: "rgba(255, 255, 255, 0.10)",
          backdropFilter: "blur(20px)",
        }}
      >
        {isMobile && (
          <IconButton onClick={() => window.history.back()} sx={{ color: "#fff" }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar
          sx={{
            bgcolor: isTeamLeadView ? "#42A5F5" : "#4DA3FF",
            width: 48,
            height: 48,
          }}
        >
          {selectedEmployee.name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {selectedEmployee.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            {isTeamLeadView ? (
              <>
                <Chip
                  label={selectedEmployee.team || "No Team"}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    bgcolor: getTeamColor(selectedEmployee.team),
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                />
                {selectedEmployee.employeeId && (
                  <Chip
                    label={`ID: ${selectedEmployee.employeeId}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 11,
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.65)",
                    }}
                  />
                )}
              </>
            ) : (
              <>
                <Chip
                  label="Team Lead"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    bgcolor: "#4DA3FF",
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                />
                {selectedEmployee.email && (
                  <Chip
                    label={selectedEmployee.email}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 10,
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.65)",
                  }}
                  />
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: "#F5F7FA",
        }}
      >
        {Object.keys(groupedMessages).length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "rgba(0, 0, 0, 0.5)" }}>
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <Box key={date}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: 12,
                    px: 2,
                    py: 0.5,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "12px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {date}
                </Typography>
              </Box>
              {msgs.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isOwnMessage={msg.senderId._id === currentUser?._id}
                  currentUser={currentUser}
                />
              ))}
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} onMarkRead={onMarkRead} />
    </Box>
  );
};

export default ChatWindow;
