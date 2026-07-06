import React from "react";

import {
  Box,
  Toolbar
} from "@mui/material";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({
  children,
  menuItems
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />

      <Sidebar
        menuItems={menuItems}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#F4F8FC",
          minHeight: "100vh"
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;