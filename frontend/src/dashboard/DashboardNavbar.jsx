import React from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Tooltip
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 260;

const DashboardNavbar = ({
  title,
  user,
  notificationCount = 0
}) => {

  return (

    <AppBar

      position="fixed"

      elevation={2}

      sx={{

        width: `calc(100% - ${drawerWidth}px)`,

        ml: `${drawerWidth}px`,

        background: "#FFFFFF",

        color: "#222"

      }}

    >

      <Toolbar>

        {/* Page Title */}

        <Typography

          variant="h5"

          sx={{

            fontWeight: 700,

            color: "#0D3B66"

          }}

        >

          {title}

        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search */}

        <Tooltip title="Search">

          <IconButton>

            <SearchIcon />

          </IconButton>

        </Tooltip>

        {/* Notifications */}

        <Tooltip title="Notifications">

          <IconButton>

            <Badge

              badgeContent={notificationCount}

              color="error"

            >

              <NotificationsIcon />

            </Badge>

          </IconButton>

        </Tooltip>

        {/* Settings */}

        <Tooltip title="Settings">

          <IconButton>

            <SettingsIcon />

          </IconButton>

        </Tooltip>

        {/* Profile */}

        <Box

          sx={{

            display: "flex",

            alignItems: "center",

            ml: 3

          }}

        >

          <Avatar

            sx={{

              bgcolor: "#1976D2",

              width: 42,

              height: 42,

              mr: 1.5

            }}

          >

            {

              user?.name

                ? user.name.charAt(0).toUpperCase()

                : "U"

            }

          </Avatar>

          <Box>

            <Typography

              sx={{

                fontWeight: 700,

                fontSize: 15

              }}

            >

              {

                user?.name ||

                "User"

              }

            </Typography>

            <Typography

              sx={{

                fontSize: 12,

                color: "gray"

              }}

            >

              {

                user?.role ||

                "Employee"

              }

            </Typography>

          </Box>

        </Box>

      </Toolbar>

    </AppBar>

  );

};

export default DashboardNavbar;