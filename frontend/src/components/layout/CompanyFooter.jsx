import { Box, Typography } from "@mui/material";

const CompanyFooter = () => {
  return (
    <Box
      sx={{
        mt: 3,

        px: 3,
        py: 2,

        borderRadius: "20px",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",

        background:
          "linear-gradient(135deg, rgba(255,255,255,.15), rgba(255,255,255,.08))",

        border: "1px solid rgba(255,255,255,.15)",

        boxShadow: "0 8px 25px rgba(0,0,0,.15)",
      }}
    >
      {/* Left */}

      <Typography
        sx={{
          color: "rgba(255,255,255,.80)",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        © {new Date().getFullYear()} Employee Task Management System
      </Typography>

      {/* Center */}

      <Box
        component="img"
        src="/logos/company_logos.png"
        alt="Company Logos"
        sx={{
          height: 34,

          objectFit: "contain",

          opacity: .95,
        }}
      />

      {/* Right */}

      <Typography
        sx={{
          color: "rgba(255,255,255,.80)",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Version 1.0.0
      </Typography>
    </Box>
  );
};

export default CompanyFooter;