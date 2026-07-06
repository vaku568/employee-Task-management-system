const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const dashboardController =
  require("./teamlead-dashboard.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  dashboardController.getTeamLeadDashboard
);

module.exports = router;