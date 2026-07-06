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
    path: "/teamlead/repository",
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
  {
    id: "reports",
    label: "Reports",
    path: "/teamlead/reports",
    icon: <AssessmentRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: null,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/teamlead/settings",
    icon: <SettingsRoundedIcon />,
    permission: "TEAM_LEAD",
    activeColor: "#42A5F5",
    badge: null,
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
    id: "tasks",
    label: "My Tasks",
    path: "/employee/tasks",
    icon: <TaskRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "submit",
    label: "Submit Solution",
    path: "/employee/submit",
    icon: <UploadFileRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "history",
    label: "Submission History",
    path: "/employee/history",
    icon: <DescriptionRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "repository",
    label: "Repository",
    path: "/employee/repository",
    icon: <FolderRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "chat",
    label: "Chat",
    path: "/employee/chat",
    icon: <ChatRoundedIcon />,
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
  {
    id: "reports",
    label: "Reports",
    path: "/employee/reports",
    icon: <AssessmentRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/employee/settings",
    icon: <SettingsRoundedIcon />,
    permission: "EMPLOYEE",
    activeColor: "#43A047",
    badge: null,
  },
];