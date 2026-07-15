const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const employeeDailyReportController = require("./employee-daily-report.controller");

router.post(
  "/eod",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  employeeDailyReportController.createEODReport
);

router.get(
  "/eod/my",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  employeeDailyReportController.getMyEODReports
);

router.get(
  "/eod/stats",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  employeeDailyReportController.getEODStats
);

router.get(
  "/eod/assigned-tasks",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  employeeDailyReportController.getEmployeeAssignedTasks
);

router.get(
  "/eod/team-lead",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  employeeDailyReportController.getEmployeeTeamLead
);

router.put(
  "/eod/:id",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  employeeDailyReportController.updateEODReport
);

module.exports = router;
