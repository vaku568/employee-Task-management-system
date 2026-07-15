import {
  Box,
  Typography,
  Divider,
  Button,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { teamLeadMenus, employeeMenus } from "../../utils/menuConfig";
import SidebarItem from "./SidebarItem";

import { useAuth } from "../../hooks/useAuth";
import { useChatUnread } from "../../contexts/ChatUnreadContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import ProfileDialog from "./ProfileDialog";

const drawerWidth = 300;

const GlassSidebar = ({ role = "TEAM_LEAD" }) => {
  const { logout, user } = useAuth();
  const { totalUnread } = useChatUnread();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const menus = role === "TEAM_LEAD" ? teamLeadMenus : employeeMenus;
  const roleLabel = role === "TEAM_LEAD" ? "TEAM LEAD" : "EMPLOYEE";
  const roleColor = role === "TEAM_LEAD" ? "#42A5F5" : "#43A047";

  // Update chat badge with unread count
  const updatedMenus = menus.map(menu => {
    if (menu.id === "chat" || menu.id === "team-chat") {
      return { ...menu, badge: totalUnread > 0 ? totalUnread : null };
    }
    if (menu.id === "notifications") {
      return { ...menu, badge: unreadCount > 0 ? unreadCount : null };
    }
    return menu;
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Perform logout cleanup
    logout();
    
    // Show success message
    setSnackbar({
      open: true,
      message: "Logged out successfully.",
      severity: "success",
    });
    
    // Wait for snackbar to show and then redirect
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 500);
  };

  return (
    <Box
      sx={{
        width: drawerWidth,

        position: "fixed",

        top: 0,
        left: 0,
        bottom: 0,

        display: "flex",
        flexDirection: "column",

        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",

        background:
          "linear-gradient(180deg, rgba(13,32,72,.88), rgba(22,52,120,.82))",

        borderRight: "1px solid rgba(255,255,255,.12)",

        boxShadow: "8px 0 30px rgba(0,0,0,.25)",

        overflow: "hidden",

        zIndex: 1200,
      }}
    >
      {/* ====================== */}
      {/* Header */}
      {/* ====================== */}

      <Box
        sx={{
          p: 3,

          display: "flex",
          alignItems: "center",

          gap: 2,
        }}
      >
        <Avatar
          src="/favicon.svg"
          sx={{
            width: 56,
            height: 56,

            bgcolor: "#fff",
          }}
        />

        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            ETMS
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,.7)",
              fontSize: 13,
            }}
          >
            Employee Task System
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.08)",
        }}
      />

      {/* ====================== */}
      {/* Logged User */}
      {/* ====================== */}

      <Box
        sx={{
          px: 3,
          py: 2,

          display: "flex",
          alignItems: "center",

          gap: 2,
          cursor: "pointer",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.05)",
          },
        }}
        onClick={() => setProfileDialogOpen(true)}
      >
        <Avatar
          sx={{
            bgcolor: roleColor,
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || "T"}
        </Avatar>

        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            {user?.name || "User"}
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,.65)",
              fontSize: 12,
            }}
          >
            {roleLabel}
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.08)",
        }}
      />

      {/* ====================== */}
      {/* Menu */}
      {/* ====================== */}

      <Box
        sx={{
          flex: 1,

          overflowY: "auto",

          p: 2,

          "&::-webkit-scrollbar": {
            width: 5,
          },

          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,.18)",
            borderRadius: 20,
          },
        }}
      >
        {updatedMenus.map((menu) => (
          <SidebarItem
            key={menu.id}
            item={menu}
          />
        ))}
      </Box>

      {/* ====================== */}
      {/* Footer */}
      {/* ====================== */}

      <Box
        sx={{
          p: 2,
        }}
      >
        <Divider
          sx={{
            mb: 2,
            borderColor: "rgba(255,255,255,.08)",
          }}
        />

        <Button
          fullWidth
          startIcon={isLoggingOut ? <CircularProgress size={20} color="inherit" /> : <LogoutRoundedIcon />}
          variant="contained"
          color="error"
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            py: 1.4,

            borderRadius: "14px",

            textTransform: "none",

            fontWeight: 700,

            fontSize: 15,

            boxShadow: "none",

            "&:hover": {
              boxShadow: "0 10px 25px rgba(244,67,54,.35)",
            },
          }}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </Box>

      {/* Snackbar for logout feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ minWidth: 300 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Profile Dialog */}
      <ProfileDialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
    </Box>
  );
};

export default GlassSidebar;