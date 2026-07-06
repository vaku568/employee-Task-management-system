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

import AssignmentIcon from "@mui/icons-material/Assignment";

import UploadFileIcon from "@mui/icons-material/UploadFile";

import HistoryIcon from "@mui/icons-material/History";

import FolderIcon from "@mui/icons-material/Folder";

import ChatIcon from "@mui/icons-material/Chat";

import NotificationsIcon from "@mui/icons-material/Notifications";

import BarChartIcon from "@mui/icons-material/BarChart";

import SettingsIcon from "@mui/icons-material/Settings";

const EmployeeLayout = ({

children,

pageTitle

}) => {

const navigate = useNavigate();

const user =

JSON.parse(

localStorage.getItem("user")

) || {};

const [selectedItem,

setSelectedItem] =

useState(pageTitle);

const menuItems = [

{

text:"Dashboard",

icon:<DashboardIcon/>,

path:"/employee-dashboard"

},

{

text:"My Tasks",

icon:<AssignmentIcon/>,

path:"/employee/tasks"

},

{

text:"Submit Solution",

icon:<UploadFileIcon/>,

path:"/employee/submit"

},

{

text:"Submission History",

icon:<HistoryIcon/>,

path:"/employee/history"

},

{

text:"Repository",

icon:<FolderIcon/>,

path:"/employee/repository"

},

{

text:"Chats",

icon:<ChatIcon/>,

path:"/employee/chats"

},

{

text:"Notifications",

icon:<NotificationsIcon/>,

path:"/employee/notifications"

},

{

text:"Reports",

icon:<BarChartIcon/>,

path:"/employee/reports"

},

{

text:"Settings",

icon:<SettingsIcon/>,

path:"/employee/settings"

}

];

const handleSelect=(item)=>{

setSelectedItem(item.text);

navigate(item.path);

};

const handleLogout=()=>{

localStorage.clear();

navigate("/");

};

return(

<Box sx={{display:"flex"}}>

<DashboardSidebar

title="Employee Portal"

logo="/logos/company_logos.png"

menuItems={menuItems}

selectedItem={selectedItem}

onSelect={handleSelect}

onLogout={handleLogout}

/>

<Box

component="main"

sx={{

flexGrow:1,

background:"#F5F8FC",

minHeight:"100vh"

}}

>

<DashboardNavbar

title={pageTitle}

user={user}

notificationCount={5}

/>

<Toolbar/>

<Box

sx={{

p:3

}}

>

{children}

</Box>

</Box>

</Box>

);

};

export default EmployeeLayout;