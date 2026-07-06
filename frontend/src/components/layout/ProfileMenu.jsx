import { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProfileMenu = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    handleClose();

    if (user?.role === "TEAM_LEAD") {
      navigate("/teamlead/settings");
    } else {
      navigate("/employee/settings");
    }
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <>
      <Tooltip title="Account">
        <IconButton
          onClick={handleOpen}
          sx={{
            p: 0,

            borderRadius: "18px",

            transition: ".3s",

            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <Avatar
            sx={{
              width: 50,
              height: 50,

              bgcolor: "#42A5F5",

              fontWeight: 700,

              fontSize: 20,

              border: "2px solid rgba(255,255,255,.25)",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "T"}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,

            width: 310,

            borderRadius: "22px",

            overflow: "hidden",

            color: "#fff",

            backdropFilter: "blur(22px)",

            background:
              "linear-gradient(135deg, rgba(20,35,75,.95), rgba(40,65,130,.90))",

            border: "1px solid rgba(255,255,255,.12)",

            boxShadow: "0 20px 45px rgba(0,0,0,.30)",
          },
        }}
      >
        <Box
          sx={{
            p: 3,

            display: "flex",

            alignItems: "center",

            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,

              bgcolor: "#42A5F5",

              fontSize: 22,

              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "T"}
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,

                fontSize: 17,
              }}
            >
              {user?.name || "Team Lead"}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.70)",

                fontSize: 13,
              }}
            >
              {user?.email || "teamlead@email.com"}
            </Typography>

            <Chip
              size="small"
              label={user?.role || "TEAM_LEAD"}
              sx={{
                mt: 1,

                bgcolor: "#42A5F5",

                color: "#fff",

                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: "rgba(255,255,255,.08)",
          }}
        />

        <MenuItem
          onClick={handleClose}
          sx={{
            py: 1.6,
          }}
        >
          <ListItemIcon>
            <PersonRoundedIcon sx={{ color: "#fff" }} />
          </ListItemIcon>

          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleSettings}
          sx={{
            py: 1.6,
          }}
        >
          <ListItemIcon>
            <SettingsRoundedIcon sx={{ color: "#fff" }} />
          </ListItemIcon>

          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider
          sx={{
            borderColor: "rgba(255,255,255,.08)",
          }}
        />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.6,

            color: "#ffb4b4",

            "&:hover": {
              bgcolor: "rgba(255,0,0,.08)",
            },
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon sx={{ color: "#ffb4b4" }} />
          </ListItemIcon>

          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;