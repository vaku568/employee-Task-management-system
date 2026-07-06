import {
  Box,
  Typography,
  Divider,
  Button,
  Avatar,
} from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { teamLeadMenus } from "../../utils/menuConfig";
import SidebarItem from "./SidebarItem";

import { useAuth } from "../../hooks/useAuth";

const drawerWidth = 300;

const GlassSidebar = () => {
  const { logout, user } = useAuth();

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
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#42A5F5",
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
            {user?.name || "Team Lead"}
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,.65)",
              fontSize: 12,
            }}
          >
            TEAM LEAD
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
        {teamLeadMenus.map((menu) => (
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
          startIcon={<LogoutRoundedIcon />}
          variant="contained"
          color="error"
          onClick={logout}
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
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default GlassSidebar;