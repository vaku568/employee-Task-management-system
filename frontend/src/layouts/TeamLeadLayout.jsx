import React, { useState } from "react";

import {
  Box,
  Toolbar
} from "@mui/material";

import {
  useNavigate
} from "react-router-dom";

import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardNavbar from "../dashboard/DashboardNavbar";

/* Icons */

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
import FolderIcon from "@mui/icons-material/Folder";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

const TeamLeadLayout = ({
  children,
  pageTitle
}) => {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  const [selectedItem, setSelectedItem] =
    useState(pageTitle);

  const menuItems = [

    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/teamlead-dashboard"
    },

    {
      text: "Employees",
      icon: <PeopleIcon />,
      path: "/teamlead/employees"
    },

    {
      text: "Work Allocation",
      icon: <AssignmentIcon />,
      path: "/teamlead/work-allocation"
    },

    {
      text: "Assigned History",
      icon: <HistoryIcon />,
      path: "/teamlead/assigned-history"
    },

    {
      text: "Approvals",
      icon: <AssignmentTurnedInIcon />,
      path: "/teamlead/approvals"
    },

    {
      text: "Repository",
      icon: <FolderIcon />,
      path: "/teamlead/repository"
    },

    {
      text: "Chats",
      icon: <ChatIcon />,
      path: "/teamlead/chats"
    },

    {
      text: "Notifications",
      icon: <NotificationsIcon />,
      path: "/teamlead/notifications"
    },

    {
      text: "Reports",
      icon: <BarChartIcon />,
      path: "/teamlead/reports"
    },

    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/teamlead/settings"
    }

  ];

  const handleSelect = (item) => {

    setSelectedItem(item.text);

    navigate(item.path);

  };

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };

  return (

    <Box sx={{ display: "flex" }}>

      <DashboardSidebar

        title="Team Lead Portal"

        logo="/logos/company_logos.png"

        menuItems={menuItems}

        selectedItem={selectedItem}

        onSelect={handleSelect}

        onLogout={handleLogout}

      />

      <Box

        component="main"

        sx={{

          flexGrow: 1,

          background: "#F5F8FC",

          minHeight: "100vh"

        }}

      >

        <DashboardNavbar

          title={pageTitle}

          user={user}

          notificationCount={8}

        />

        <Toolbar />

        <Box sx={{ p: 3 }}>

          {children}

        </Box>

      </Box>

    </Box>

  );

};

export default TeamLeadLayout;