const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const dashboardController =
  require("./employee-dashboard.controller");

/*
====================================
EMPLOYEE DASHBOARD
====================================
*/

router.get(
  "/employee",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  dashboardController.getEmployeeDashboard
);

/*
====================================
ASSIGNED TASKS
====================================
*/

router.get(
  "/tasks",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  dashboardController.getAssignedTasks
);

/*
====================================
ACCEPT TASK
ASSIGNED -> PROGRESS
====================================
*/

router.put(
  "/tasks/:id/accept",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  dashboardController.acceptTask
);

module.exports = router;