import {
  Box,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  Button,
  Alert
} from "@mui/material";

import { useState } from "react";

import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";

import {
  Schedule,
  CheckCircle,
  ArrowBack,
  Refresh
} from "@mui/icons-material";

import axiosInstance from "../../services/axiosInstance";

const WaitingForApproval = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRefreshStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/auth/me");

      if (response.data.status === "APPROVED") {
        // Redirect to login page - user will need to login again
        navigate("/employee-login");
      } else if (response.data.status === "REJECTED") {
        navigate("/registration-rejected");
      }
      // If still PENDING, just stay on this page
    } catch (err) {
      setError("Failed to check status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/office-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(5,25,45,.85),rgba(15,60,95,.80))"
        }}
      />

      {/* Glass Card */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        sx={{
          position: "relative",
          zIndex: 2,
          width: 500,
          maxWidth: "92%",
          p: 6,
          borderRadius: 6,
          background: "rgba(255,255,255,.12)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,.18)",
          boxShadow: "0 25px 60px rgba(0,0,0,.40)"
        }}
      >
        {/* Avatar */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              background: "linear-gradient(135deg, #FFA726, #FF9800)",
              boxShadow: "0 8px 25px rgba(255,152,0,.35)"
            }}
          >
            <Schedule sx={{ fontSize: 60 }} />
          </Avatar>
        </Box>

        <Typography
          variant="h4"
          align="center"
          sx={{
            color: "#FFFFFF",
            fontWeight: 700,
            mb: 2
          }}
        >
          Registration Successful
        </Typography>

        <Typography
          align="center"
          mb={4}
          sx={{
            color: "rgba(255,255,255,.80)",
            fontSize: 16,
            lineHeight: 1.6
          }}
        >
          Your account is waiting for Team Lead approval.
          Please wait until your registration has been approved.
        </Typography>

        {/* Status Indicator */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            py: 3,
            px: 4,
            mb: 4,
            borderRadius: 3,
            background: "rgba(255,167,38,.15)",
            border: "1px solid rgba(255,167,38,.30)"
          }}
        >
          <CircularProgress
            size={24}
            sx={{
              color: "#FFA726"
            }}
          />
          <Typography
            sx={{
              color: "#FFA726",
              fontWeight: 600,
              fontSize: 16
            }}
          >
            Status: Waiting for Approval
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
            onClick={handleRefreshStatus}
            disabled={loading}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 20,
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              background: "linear-gradient(90deg,#1976D2,#42A5F5)",
              boxShadow: "0 10px 25px rgba(25,118,210,.35)",
              "&:hover": {
                background: "linear-gradient(90deg,#1565C0,#2196F3)"
              }
            }}
          >
            {loading ? "Checking..." : "Refresh Status"}
          </Button>

          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 20,
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              borderColor: "rgba(255,255,255,.30)",
              color: "#FFFFFF",
              "&:hover": {
                borderColor: "rgba(255,255,255,.50)",
                background: "rgba(255,255,255,.08)"
              }
            }}
          >
            Back to Portal
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default WaitingForApproval;
