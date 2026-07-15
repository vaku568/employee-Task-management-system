import { Box, Typography } from "@mui/material";
import FilePreview from "./FilePreview";

const MessageBubble = ({ message, isOwnMessage, currentUser }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          p: 2,
          borderRadius: isOwnMessage ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          bgcolor: isOwnMessage
            ? "#DCF8C6"
            : "#F1F1F1",
          color: "#1a1a1a",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {/* Message Text */}
        {message.message && (
          <Typography
            sx={{
              fontSize: 14,
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            {message.message}
          </Typography>
        )}

        {/* File Attachments */}
        {message.files && message.files.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {message.files.map((file, index) => (
              <FilePreview key={index} file={file} />
            ))}
          </Box>
        )}

        {/* Timestamp */}
        <Typography
          sx={{
            fontSize: 11,
            color: "rgba(0, 0, 0, 0.5)",
            mt: message.message || (message.files?.length > 0) ? 0.5 : 0,
            textAlign: "right",
          }}
        >
          {formatTime(message.createdAt)}
          {!message.isRead && isOwnMessage && (
            <span style={{ marginLeft: 4 }}>✓</span>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
