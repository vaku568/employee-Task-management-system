import { Box, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color, gradient }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 3,
        borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.25))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.45)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)",
        transition: "all 0.35s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-5px) scale(1.02)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.28), inset 0 1px 1px rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.55)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: gradient,
          borderRadius: "20px 20px 0 0",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            background: gradient,
            boxShadow: `0 8px 25px ${color}40`,
          }}
        >
          {icon}
        </Avatar>
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: "#0f172a",
          mb: 0.5,
          fontSize: { xs: "2rem", md: "2.5rem" },
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "rgba(15, 23, 42, 0.85)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default StatCard;
