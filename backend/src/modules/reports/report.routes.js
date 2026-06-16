const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const reportController =
  require("./report.controller");

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  reportController.getSummaryReport
);

module.exports = router;