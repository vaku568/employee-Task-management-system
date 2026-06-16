const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const teamController =
  require("./team-management.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  teamController.getAllTeams
);

router.get(
  "/:teamName/employees",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  teamController.getEmployeesByTeam
);

module.exports = router;