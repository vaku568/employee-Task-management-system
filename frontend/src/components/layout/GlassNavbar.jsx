import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Box,
  InputBase,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import NotificationBell from "./NotificationBell";
import ProfileMenu from "./ProfileMenu";

const GlassNavbar = ({
  title = "Dashboard",
  subtitle = "Employee Task Management System",
}) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "transparent",
        boxShadow: "none",
        px: 3,
        pt: 2,
        zIndex: 1100,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "1280px",

            borderRadius: "24px",

            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",

            background:
              "linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.08))",

            border: "1px solid rgba(255,255,255,.18)",

            boxShadow: "0 12px 35px rgba(0,0,0,.18)",

            overflow: "hidden",
          }}
        >
          <Toolbar
            sx={{
              minHeight: 82,

              px: 3,

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              gap: 3,
            }}
          >
            {/* Left */}

            <Box
              sx={{
                width: 260,
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  color: "rgba(255,255,255,.65)",
                  fontSize: 13,
                }}
              >
                {subtitle}
              </Typography>
            </Box>

            {/* Search */}

            <Paper
              elevation={0}
              sx={{
                flex: 1,

                maxWidth: 430,

                display: "flex",

                alignItems: "center",

                height: 48,

                px: 2,

                borderRadius: "15px",

                bgcolor: "rgba(255,255,255,.12)",

                border: "1px solid rgba(255,255,255,.12)",

                backdropFilter: "blur(15px)",
              }}
            >
              <SearchRoundedIcon
                sx={{
                  color: "rgba(255,255,255,.60)",
                }}
              />

              <InputBase
                placeholder="Search..."
                sx={{
                  ml: 1.5,
                  flex: 1,
                  color: "#fff",

                  "& input::placeholder": {
                    color: "rgba(255,255,255,.55)",
                    opacity: 1,
                  },
                }}
              />
            </Paper>

            {/* Right */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  textAlign: "right",
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>

                <Typography
                  sx={{
                    color: "rgba(255,255,255,.65)",
                    fontSize: 12,
                  }}
                >
                  Welcome Back
                </Typography>
              </Box>

              <NotificationBell />

              <ProfileMenu />
            </Box>
          </Toolbar>
        </Paper>
      </Box>
    </AppBar>
  );
};

export default GlassNavbar;