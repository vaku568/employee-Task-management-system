import React from "react";

import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 260;

const DashboardSidebar = ({
  title,
  logo,
  menuItems,
  selectedItem,
  onSelect,
  onLogout
}) => {

  return (

    <Drawer

      variant="permanent"

      sx={{

        width: drawerWidth,

        flexShrink: 0,

        "& .MuiDrawer-paper": {

          width: drawerWidth,

          boxSizing: "border-box",

          background:
            "#07192F",

          color: "#FFFFFF",

          borderRight: "none"

        }

      }}

    >

      <Toolbar>

        <Box

          sx={{

            width: "100%",

            textAlign: "center",

            py: 2

          }}

        >

          {

            logo &&

            <Box

              component="img"

              src={logo}

              sx={{

                width: 150,

                mb: 2

              }}

            />

          }

          <Typography

            sx={{

              fontWeight: 700,

              fontSize: 18,

              lineHeight: 1.4

            }}

          >

            {title}

          </Typography>

        </Box>

      </Toolbar>

      <Divider

        sx={{

          borderColor:
            "rgba(255,255,255,.12)"

        }}

      />

      <List

        sx={{

          px: 1,

          mt: 1,

          flexGrow: 1

        }}

      >

        {

          menuItems.map((item) => (

            <ListItemButton

              key={item.text}

              selected={
                selectedItem === item.text
              }

              onClick={() => onSelect(item)}

              sx={{

                mb: 1,

                borderRadius: 2,

                py: 1.3,

                transition: ".3s",

                "&.Mui-selected": {

                  background:
                    "#1976D2"

                },

                "&.Mui-selected:hover": {

                  background:
                    "#1565C0"

                },

                "&:hover": {

                  background:
                    "#0F4C81"

                }

              }}

            >

              <ListItemIcon

                sx={{

                  color: "#FFFFFF",

                  minWidth: 42

                }}

              >

                {item.icon}

              </ListItemIcon>

              <ListItemText

                primary={item.text}

              />

            </ListItemButton>

          ))

        }

      </List>

      <Divider

        sx={{

          borderColor:
            "rgba(255,255,255,.12)"

        }}

      />

      <Box p={2}>

        <ListItemButton

          onClick={onLogout}

          sx={{

            borderRadius: 2,

            "&:hover": {

              background:
                "#D32F2F"

            }

          }}

        >

          <ListItemIcon

            sx={{

              color: "#FFFFFF"

            }}

          >

            <LogoutIcon />

          </ListItemIcon>

          <ListItemText

            primary="Logout"

          />

        </ListItemButton>

      </Box>ttttttttttttttt

    </Drawer>

  );

};

export default DashboardSidebar;