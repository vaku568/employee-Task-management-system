import {
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip
} from "@mui/material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from "@mui/icons-material/Notifications";

import TeamLeadLayout from "../../layouts/TeamLeadLayout";
import StatisticsCard from "../../dashboard/StatisticsCard";

import DashboardFooter from "../../dashboard/DashboardFooter";

import QuickActions from "../../dashboard/QuickActions";

import RecentActivity from "../../dashboard/RecentActivity";

import PendingApprovalTable from "../../dashboard/PendingApprovalTable";

import TaskProgressChart from "../../dashboard/TaskProgressChart";

import TeamPerformanceChart from "../../dashboard/TeamPerformanceChart";

const taskData = [
  {
    name: "Completed",
    value: 389
  },
  {
    name: "Active",
    value: 128
  },
  {
    name: "Pending",
    value: 17
  }
];

const teamData = [
  {
    team: "ML",
    tasks: 72
  },
  {
    team: "Database",
    tasks: 58
  },
  {
    team: "Cyber",
    tasks: 41
  },
  {
    team: "Writing",
    tasks: 94
  }
];

const COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FF9800"
];

const quickActions = [

{

label:"Add Employee",

icon:<AddIcon />,

color:"#1976D2",

onClick:()=>{}

},

{

label:"Assign Task",

icon:<AssignmentIcon />,

color:"#2E7D32",

onClick:()=>{}

},

{

label:"Review Solutions",

icon:<SendIcon />,

color:"#F57C00",

onClick:()=>{}

},

{

label:"Generate Report",

icon:<AssessmentIcon />,

color:"#7B1FA2",

onClick:()=>{}

},

{

label:"Send Notification",

icon:<NotificationsIcon />,

color:"#0288D1",

onClick:()=>{}

}

];

const recentActivities = [

{

title:"Rahul submitted Image Classification",

time:"2 minutes ago",

icon:<AssignmentIcon />,

color:"#4CAF50"

},

{

title:"Priya completed SQL Task",

time:"15 minutes ago",

icon:<TaskAltIcon />,

color:"#1976D2"

},

{

title:"New employee joined Writing Team",

time:"Today",

icon:<PeopleIcon />,

color:"#FF9800"

}

];

const pendingRows = [

{

id:1,

employee:"Rahul Kumar",

team:"ML",

task:"Image Classification",

time:"10:45 AM",

status:"Pending"

},

{

id:2,

employee:"Priya",

team:"Database",

task:"SQL Optimization",

time:"11:20 AM",

status:"Pending"

},

{

id:3,

employee:"Vijay",

team:"Cyber",

task:"Security Audit",

time:"12:10 PM",

status:"Pending"

}

];

const TeamLeadDashboard = () => {

  return (

    <TeamLeadLayout pageTitle="Dashboard">

      <Box>

        <Typography
          variant="h4"
          fontWeight={700}
          mb={4}
        >
          Dashboard Overview
        </Typography>
        <Grid
  container
  spacing={3}
>

  <Grid
    item
    xs={12}
    sm={6}
    md={3}
  >

    <StatisticsCard
      title="Total Employees"
      value="40"
      icon={<PeopleIcon />}
      color="#1976D2"
    />

  </Grid>

  <Grid
    item
    xs={12}
    sm={6}
    md={3}
  >

    <StatisticsCard
      title="Active Tasks"
      value="128"
      icon={<AssignmentIcon />}
      color="#2E7D32"
    />

  </Grid>

  <Grid
    item
    xs={12}
    sm={6}
    md={3}
  >

    <StatisticsCard
      title="Pending Reviews"
      value="17"
      icon={<PendingActionsIcon />}
      color="#F57C00"
    />

  </Grid>

  <Grid
    item
    xs={12}
    sm={6}
    md={3}
  >

    <StatisticsCard
      title="Completed Tasks"
      value="389"
      icon={<TaskAltIcon />}
      color="#8E24AA"
    />

  </Grid>

</Grid>
<Box mt={6}>

  <Typography
    variant="h5"
    fontWeight={700}
    mb={3}
  >
    Quick Actions
  </Typography>

  <Grid
    container
    spacing={3}
  >

    <Grid item>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        size="large"
      >
        Add Employee
      </Button>

    </Grid>

    <Grid item>

      <Button
        variant="contained"
        color="success"
        startIcon={<AssignmentIcon />}
        size="large"
      >
        Assign Task
      </Button>

    </Grid>

    <Grid item>

      <Button
        variant="contained"
        color="warning"
        startIcon={<SendIcon />}
        size="large"
      >
        Review Solutions
      </Button>

    </Grid>

    <Grid item>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<AssessmentIcon />}
        size="large"
      >
        Generate Report
      </Button>

    </Grid>

    <Grid item>

      <Button
        variant="contained"
        color="info"
        startIcon={<NotificationsIcon />}
        size="large"
      >
        Send Notification
      </Button>

    </Grid>

  </Grid>

</Box>
<Box mt={6}>

  <Grid
    container
    spacing={3}
  >

    {/* Task Progress */}

    <Grid
      item
      xs={12}
      md={6}
    >

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          height: "100%"
        }}
      >

        <Typography
          variant="h6"
          fontWeight={700}
          mb={3}
        >
          Task Progress
        </Typography>

        <Typography mb={1}>
          ML Team
        </Typography>

        <LinearProgress
          variant="determinate"
          value={82}
          sx={{
            height: 10,
            borderRadius: 5,
            mb: 3
          }}
        />

        <Typography mb={1}>
          Database Team
        </Typography>

        <LinearProgress
          color="success"
          variant="determinate"
          value={67}
          sx={{
            height: 10,
            borderRadius: 5,
            mb: 3
          }}
        />

        <Typography mb={1}>
          Cyber Team
        </Typography>

        <LinearProgress
          color="warning"
          variant="determinate"
          value={48}
          sx={{
            height: 10,
            borderRadius: 5,
            mb: 3
          }}
        />

        <Typography mb={1}>
          Writing Team
        </Typography>

        <LinearProgress
          color="secondary"
          variant="determinate"
          value={94}
          sx={{
            height: 10,
            borderRadius: 5
          }}
        />

      </Paper>

    </Grid>

    {/* Notifications */}

    <Grid
      item
      xs={12}
      md={6}
    >

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          height: "100%"
        }}
      >

        <Typography
          variant="h6"
          fontWeight={700}
          mb={3}
        >
          Recent Notifications
        </Typography>

        <List>

          <ListItem>
            <ListItemText
              primary="John submitted Task #124"
              secondary="2 minutes ago"
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Sarah requested review"
              secondary="8 minutes ago"
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Database Team completed Sprint"
              secondary="20 minutes ago"
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="New employee joined ML Team"
              secondary="Today"
            />
          </ListItem>

        </List>

      </Paper>

    </Grid>

  </Grid>

</Box>

<Box mt={6}>

  <Typography
    variant="h5"
    fontWeight={700}
    mb={3}
  >
    Pending Solution Approvals
  </Typography>

  <Paper
    elevation={3}
    sx={{
      borderRadius: 4,
      overflow: "hidden"
    }}
  >

    <Table>

      <TableHead>

        <TableRow
          sx={{
            background: "#1976D2"
          }}
        >

          <TableCell
            sx={{
              color: "#FFFFFF",
              fontWeight: 700
            }}
          >
            Employee
          </TableCell>

          <TableCell
            sx={{
              color: "#FFFFFF",
              fontWeight: 700
            }}
          >
            Team
          </TableCell>

          <TableCell
            sx={{
              color: "#FFFFFF",
              fontWeight: 700
            }}
          >
            Task
          </TableCell>

          <TableCell
            sx={{
              color: "#FFFFFF",
              fontWeight: 700
            }}
          >
            Submitted
          </TableCell>

          <TableCell
            sx={{
              color: "#FFFFFF",
              fontWeight: 700
            }}
          >
            Status
          </TableCell>

        </TableRow>

      </TableHead>

      <TableBody>

        <TableRow>

          <TableCell>Rahul Kumar</TableCell>

          <TableCell>ML</TableCell>

          <TableCell>Image Classification</TableCell>

          <TableCell>10:45 AM</TableCell>

          <TableCell>

            <Chip
              label="Pending"
              color="warning"
            />

          </TableCell>

        </TableRow>

        <TableRow>

          <TableCell>Priya Sharma</TableCell>

          <TableCell>Database</TableCell>

          <TableCell>SQL Optimization</TableCell>

          <TableCell>11:20 AM</TableCell>

          <TableCell>

            <Chip
              label="Pending"
              color="warning"
            />

          </TableCell>

        </TableRow>

        <TableRow>

          <TableCell>Vijay Kumar</TableCell>

          <TableCell>Cyber</TableCell>

          <TableCell>Security Audit</TableCell>

          <TableCell>12:10 PM</TableCell>

          <TableCell>

            <Chip
              label="Pending"
              color="warning"
            />

          </TableCell>

        </TableRow>

        <TableRow>

          <TableCell>Meghana</TableCell>

          <TableCell>Writing</TableCell>

          <TableCell>Research Report</TableCell>

          <TableCell>01:45 PM</TableCell>

          <TableCell>

            <Chip
              label="Pending"
              color="warning"
            />

          </TableCell>

        </TableRow>

      </TableBody>

    </Table>

  </Paper>

</Box>

<Box mt={6}>

  <Typography
    variant="h5"
    fontWeight={700}
    mb={3}
  >
    Analytics Dashboard
  </Typography>

  <Grid
    container
    spacing={3}
  >

    {/* Pie Chart */}

    <Grid
      item
      xs={12}
      md={6}
    >

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4
        }}
      >

        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
        >
          Task Status Distribution
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

            <Pie
              data={taskData}
              dataKey="value"
              outerRadius={100}
              label
            >

              {taskData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </Paper>

    </Grid>

    {/* Bar Chart */}

    <Grid
      item
      xs={12}
      md={6}
    >

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4
        }}
      >

        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
        >
          Tasks Per Team
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={teamData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="team" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="tasks"
              fill="#1976D2"
            />

          </BarChart>

        </ResponsiveContainer>

      </Paper>

    </Grid>

  </Grid>

</Box>
      </Box>

    </TeamLeadLayout>

  );

};

export default TeamLeadDashboard;