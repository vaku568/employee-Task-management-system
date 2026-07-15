const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const http = require("http");

const connectDB = require("./src/config/db");
const { initializeSocket } = require("./socket/socket");

const authRoutes =
  require("./src/modules/auth/auth.routes");

const employeeRoutes =
  require("./src/modules/employee-management/employee.routes");

const taskRoutes =
  require("./src/modules/work-allocation/task.routes");

const employeeTaskRoutes =
  require("./src/modules/work-assigned/employee-task.routes");

const submissionRoutes =
  require("./src/modules/work-submission/submission.routes");

const solutionRoutes =
  require("./src/modules/solutions/solution.routes");

const reworkRoutes =
  require("./src/modules/rework/rework.routes");

const dashboardRoutes =
  require("./src/modules/employee-dashboard/employee-dashboard.routes");

const teamLeadDashboardRoutes =
  require("./src/modules/teamlead-dashboard/teamlead-dashboard.routes");

const teamManagementRoutes =
  require("./src/modules/team-management/team-management.routes");

const searchFilterRoutes =
  require("./src/modules/search-filter/search-filter.routes");

const reportRoutes =
  require("./src/modules/reports/report.routes");

const employeeDailyReportRoutes =
  require("./src/modules/reports/employee-daily-report.routes");

const notificationRoutes =
  require("./src/modules/notifications/notification.routes");

const taskChatRoutes =
require("./src/modules/task-chat/task-chat.routes");

const teamChatRoutes =
require("./src/modules/team-chat/team-chat.routes");

const userRoutes =
require("./src/modules/user/user.routes");

dotenv.config();

connectDB();

const app = express();

/*
====================================
CORS CONFIGURATION
====================================
*/

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use("/api/auth", authRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/tasks", taskRoutes);

app.use(
  "/api/my-tasks",
  employeeTaskRoutes
);

app.use(
  "/api/submissions",
  submissionRoutes
);

app.use(
  "/api/solutions",
  solutionRoutes
);

app.use(
  "/api/rework",
  reworkRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/dashboard",
  teamLeadDashboardRoutes
);

app.use(
  "/api/teams",
  teamManagementRoutes
);

app.use(
  "/api/search",
  searchFilterRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/reports",
  employeeDailyReportRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.get("/", (req, res) => {
  res.send(
    "Employee Task Management System API Running"
  );
});

app.use(
  "/api/task-chat",
  taskChatRoutes
);

app.use(
  "/api/team-chat",
  teamChatRoutes
);

app.use(
  "/api/users",
  userRoutes
);

const PORT =
  process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});