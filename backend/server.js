const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");

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

const notificationRoutes =
  require("./src/modules/notifications/notification.routes");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

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

app.get("/", (req, res) => {
  res.send(
    "Employee Task Management System API Running"
  );
});

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
  "/api/notifications",
  notificationRoutes
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});