const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const employeeTaskController =
  require("./employee-task.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  employeeTaskController.getMyTasks
);

router.get(
  "/:taskId/download",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  employeeTaskController.downloadTask
);

router.put(
  "/:taskId/accept",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  employeeTaskController.acceptTask
);

module.exports = router;