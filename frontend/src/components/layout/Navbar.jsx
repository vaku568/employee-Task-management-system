import React from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

const Navbar = ({
  title = "Dashboard",
  user = {
    name: "Team Lead",
    role: "TEAM LEAD",
  },
}) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.70)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,.35)",
        color: "#0F172A",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 74,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left Side */}

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#0D3B66",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            Employee Task Management System
          </Typography>
        </Box>

        {/* Search Box */}

        <Paper
          elevation={0}
          sx={{
            width: 360,
            height: 46,
            display: "flex",
            alignItems: "center",
            px: 2,
            borderRadius: "14px",
            bgcolor: "rgba(255,255,255,.85)",
            border: "1px solid rgba(0,0,0,.06)",
          }}
        >
          <SearchIcon
            sx={{
              color: "#64748B",
            }}
          />

          <InputBase
            placeholder="Search..."
            sx={{
              ml: 1,
              flex: 1,
            }}
          />
        </Paper>
                {/* Right Side */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          {/* Notification */}

          <IconButton
            sx={{
              width: 46,
              height: 46,
              borderRadius: "14px",
              bgcolor: "rgba(255,255,255,.80)",

              "&:hover": {
                bgcolor: "#E3F2FD",
              },
            }}
          >
            <Badge
              badgeContent={4}
              color="error"
            >
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>

          {/* Current Date */}

          <Box
            sx={{
              textAlign: "right",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
              }}
            >
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Welcome Back
            </Typography>
          </Box>

          {/* User */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 0.8,
              borderRadius: "14px",
              bgcolor: "rgba(255,255,255,.75)",
              border: "1px solid rgba(0,0,0,.06)",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#1565C0",
                width: 42,
                height: 42,
                fontWeight: 700,
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography
                fontWeight={700}
                fontSize={14}
              >
                {user.name}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {user.role}
              </Typography>
            </Box>
          </Box>

          {/* Company Logo */}

          <Box
            component="img"
            src="/logos/company_logos.png"
            alt="Company Logo"
            sx={{
              height: 42,
              ml: 1,
            }}
          />
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;