const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const dashboardController =
  require("./employee-dashboard.controller");

router.get(
  "/employee",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  dashboardController.getEmployeeDashboard
);

module.exports = router;