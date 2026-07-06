import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      sx={{
        textAlign: "center",
        mb: 5
      }}
    >
      <Typography
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: {
            xs: "2.5rem",
            sm: "3.2rem",
            md: "4rem"
          },
          lineHeight: 1.15,
          textShadow: "0 5px 25px rgba(0,0,0,.55)"
        }}
      >
        Employee Task
        <br />
        Management System
      </Typography>

      <Box
        sx={{
          width: 220,
          height: 5,
          borderRadius: 20,
          background:
            "linear-gradient(90deg,#4FC3F7,#2E7D32)",
          margin: "22px auto"
        }}
      />

      <Typography
        sx={{
          color: "#FFFFFF",
          fontSize: "1rem",
          letterSpacing: 2,
          opacity: .95
        }}
      >
        Secure • Efficient • Collaborative
      </Typography>

    </Box>
  );
};

export default HeroSection;