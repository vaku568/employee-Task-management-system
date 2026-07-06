import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 280;

const Sidebar = ({
  menuItems = [],
  activeItem = "",
  onMenuClick,
  role = "TEAM LEAD",
  userName = "Welcome",
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          border: "none",

          background:
            "linear-gradient(180deg,#0B1F4D 0%,#123B85 55%,#1E5CB3 100%)",

          color: "#FFFFFF",

          display: "flex",
          flexDirection: "column",

          boxShadow: "10px 0 30px rgba(0,0,0,.18)",
        },
      }}
    >
      <Toolbar />

      {/* Logo */}

      <Box
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          ETMS
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: .8,
          }}
        >
          Employee Task Management
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.15)",
        }}
      />

      {/* User */}

      <Box
        sx={{
          px: 3,
          py: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 54,
            height: 54,
            bgcolor: "#4FC3F7",
            fontWeight: 700,
          }}
        >
          T
        </Avatar>

        <Box>
          <Typography
            fontWeight={700}
          >
            {userName}
          </Typography>

          <Chip
            size="small"
            label={role}
            sx={{
              mt: .5,
              bgcolor: "#E3F2FD",
              color: "#1565C0",
              fontWeight: 700,
            }}
          />
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.15)",
        }}
      /><Divider
    sx={{
        borderColor: "rgba(255,255,255,.15)",
    }}
/>      {/* Navigation Menu */}

      <List
        sx={{
          px: 2,
          py: 2,
          flexGrow: 1,
        }}
      >
        {menuItems.map((item) => {
          const selected = activeItem === item.label;

          return (
            <ListItemButton
              key={item.label}
              onClick={() => onMenuClick?.(item)}
              selected={selected}
              sx={{
                mb: 1,
                borderRadius: "14px",
                px: 2,
                py: 1.3,

                color: "#FFFFFF",

                transition: "all .30s ease",

                "&.Mui-selected": {
                  background:
                    "linear-gradient(90deg,#42A5F5,#1E88E5)",

                  color: "#FFFFFF",

                  boxShadow:
                    "0 10px 25px rgba(33,150,243,.35)",
                },

                "&.Mui-selected:hover": {
                  background:
                    "linear-gradient(90deg,#42A5F5,#1E88E5)",
                },

                "&:hover": {
                  background:
                    "rgba(255,255,255,.10)",

                  transform: "translateX(6px)",
                },
              }}
            >
              {item.icon && (
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: "#FFFFFF",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              )}

              <ListItemText
  primary={
    <Typography
      sx={{
        fontSize: 15,
        fontWeight: selected ? 700 : 500,
        color: "#FFFFFF",
      }}
    >
      {item.label}
    </Typography>
  }
/>
            </ListItemButton>
          );
        })}
      </List>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.15)",
        }}
      />      {/* Footer */}

      <Box
        sx={{
          px: 3,
          py: 2.5,
        }}
      >
        <ListItemButton
          sx={{
            borderRadius: "14px",
            color: "#FFFFFF",

            "&:hover": {
              bgcolor: "rgba(255,255,255,.10)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: "#FFFFFF",
              minWidth: 42,
            }}
          >
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 600,
            }}
          />
        </ListItemButton>

        <Divider
          sx={{
            my: 2,
            borderColor: "rgba(255,255,255,.12)",
          }}
        />

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "rgba(255,255,255,.70)",
            textAlign: "center",
          }}
        >
          Employee Task Management System
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "rgba(255,255,255,.45)",
            textAlign: "center",
            mt: 0.5,
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>

    </Drawer>
  );
};

export default Sidebar;