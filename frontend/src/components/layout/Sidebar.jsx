import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar
} from "@mui/material";

const drawerWidth = 240;

const Sidebar = ({ menuItems }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#0D4D8B",
          color: "#fff"
        }
      }}
    >
      <Toolbar>
        <h2>ETMS</h2>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItemButton key={item.label}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;