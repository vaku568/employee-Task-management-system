import { useState, useRef } from "react";
import { Box, TextField, IconButton, InputAdornment, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const ChatInput = ({ onSendMessage, onMarkRead }) => {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (message.trim() || selectedFiles.length > 0) {
      onSendMessage(message, selectedFiles);
      setMessage("");
      setSelectedFiles([]);
      onMarkRead();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid rgba(255, 255, 255, 0.18)",
        bgcolor: "rgba(255, 255, 255, 0.12)",
      }}
    >
      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
          {selectedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                bgcolor: "rgba(66, 165, 245, 0.2)",
                borderRadius: "8px",
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: 12 }}>
                {file.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleRemoveFile(index)}
                sx={{ color: "#fff" }}
              >
                ✕
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Input */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          <AttachFileIcon />
        </IconButton>

        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            sx: {
              borderRadius: "24px",
              bgcolor: "#FFFFFF",
              color: "#1a1a1a",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
                borderWidth: 0,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "& input": {
                color: "#1a1a1a",
              },
              "& textarea": {
                color: "#1a1a1a",
              },
            },
          }}
        />

        <IconButton
          onClick={handleSend}
          disabled={!message.trim() && selectedFiles.length === 0}
          sx={{
            bgcolor: "#42A5F5",
            color: "#fff",
            "&:hover": {
              bgcolor: "#1976D2",
            },
            "&:disabled": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInput;
