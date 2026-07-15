import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button
} from "@mui/material";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import {
  Cancel,
  ArrowBack,
  ContactSupport
} from "@mui/icons-material";

const RegistrationRejected = () => {
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
              background: "linear-gradient(135deg, #EF5350, #F44336)",
              boxShadow: "0 8px 25px rgba(244,67,54,.35)"
            }}
          >
            <Cancel sx={{ fontSize: 60 }} />
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
          Registration Rejected
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
          Your registration request has been rejected by the Team Lead.
          Please contact the Team Lead for further information about the rejection.
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
            background: "rgba(239,83,80,.15)",
            border: "1px solid rgba(239,83,80,.30)"
          }}
        >
          <Cancel
            sx={{
              color: "#EF5350",
              fontSize: 28
            }}
          />
          <Typography
            sx={{
              color: "#EF5350",
              fontWeight: 600,
              fontSize: 16
            }}
          >
            Status: Registration Rejected
          </Typography>
        </Box>

        <Typography
          align="center"
          mb={4}
          sx={{
            color: "rgba(255,255,255,.65)",
            fontSize: 14,
            fontStyle: "italic"
          }}
        >
          If you believe this is an error, please reach out to your Team Lead.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<ContactSupport />}
            sx={{
              py: 1.5,
              px: 3,
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
            Contact Support
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

export default RegistrationRejected;
