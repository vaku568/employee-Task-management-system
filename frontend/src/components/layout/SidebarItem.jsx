import { Badge, Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ item }) => {
  return (
    <NavLink
      to={item.path}
      style={{ textDecoration: "none" }}
    >
      {({ isActive }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,

            px: 2,
            py: 1.5,
            mb: 1,

            borderRadius: "16px",

            cursor: "pointer",

            color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)",

            background: isActive
              ? `linear-gradient(135deg,
                 ${item.activeColor},
                 rgba(255,255,255,.15))`
              : "transparent",

            border: isActive
              ? "1px solid rgba(255,255,255,.25)"
              : "1px solid transparent",

            backdropFilter: isActive ? "blur(16px)" : "none",

            transition: "all .30s ease",

            boxShadow: isActive
              ? "0 8px 25px rgba(0,0,0,.18)"
              : "none",

            "&:hover": {
              background:
                "linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.08))",

              border: "1px solid rgba(255,255,255,.15)",

              transform: "translateX(6px)",

              boxShadow: "0 10px 25px rgba(0,0,0,.18)",

              color: "#fff",
            },
          }}
        >
          {/* Left Active Indicator */}
          <Box
            sx={{
              width: 4,
              height: 28,

              borderRadius: 10,

              bgcolor: isActive ? "#fff" : "transparent",

              transition: ".3s",
            }}
          />

          {/* Icon */}
          <Badge
            badgeContent={item.badge}
            color="error"
            invisible={!item.badge}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                fontSize: 24,

                color: "inherit",
              }}
            >
              {item.icon}
            </Box>
          </Badge>

          {/* Menu Text */}
          <Typography
            sx={{
              fontWeight: isActive ? 700 : 500,

              fontSize: "15px",

              flex: 1,

              letterSpacing: ".3px",
            }}
          >
            {item.label}
          </Typography>
        </Box>
      )}
    </NavLink>
  );
};

export default SidebarItem;