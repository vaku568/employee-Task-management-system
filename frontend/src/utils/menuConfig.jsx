// ======================================================
// Navigation Configuration
// Employee Task Management System
// ======================================================

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import TaskRoundedIcon from "@mui/icons-material/TaskRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

// ======================================================
// Team Lead Navigation
// ======================================================

export const teamLeadMenus = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/teamlead/dashboard",
    icon: <DashboardRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: null,
  },
  {
    id: "employees",
    label: "Employee Management",
    path: "/teamlead/employees",
    icon: <PeopleAltRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: null,
  },
  {
    id: "work-allocation",
    label: "Work Allocation",
    path: "/teamlead/work-allocation",
    icon: <AssignmentRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: null,
  },
  {
    id: "assigned-history",
    label: "Assigned History",
    path: "/teamlead/assigned-history",
    icon: <HistoryRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: null,
  },
  {
    id: "solution-approvals",
    label: "Solution Approvals",
    path: "/teamlead/solution-approvals",
    icon: <FactCheckRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: 0,
  },
  {
    id: "repository",
    label: "Solution Repository",
    path: "/teamlead/solution-repository",
    icon: <FolderRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: null,
  },
  {
    id: "chat",
    label: "Team Chat",
    path: "/teamlead/chat",
    icon: <ChatRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: null,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/teamlead/notifications",
    icon: <NotificationsRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: 0,
  },
];

// ======================================================
// Employee Navigation
// ======================================================

export const employeeMenus = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/employee/dashboard",
    icon: <DashboardRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "assigned-work",
    label: "Assigned Work",
    path: "/employee/assigned-work",
    icon: <AssignmentRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "solution-approvals",
    label: "Solution Approvals",
    path: "/employee/solution-approvals",
    icon: <FactCheckRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: 0,
  },
  {
    id: "solution-repository",
    label: "Solution Repository",
    path: "/employee/solution-repository",
    icon: <FolderRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "team-chat",
    label: "Team Chat",
    path: "/employee/team-chat",
    icon: <ChatRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "daily-reports",
    label: "EOD",
    path: "/employee/daily-reports",
    icon: <AssignmentRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/employee/notifications",
    icon: <NotificationsRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: 0,
  },
];