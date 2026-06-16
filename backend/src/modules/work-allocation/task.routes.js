const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const upload =
  require("../../config/multer");

const taskController =
  require("./task.controller");

const {
  createTaskValidation
} = require("./task.validation");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  upload.single("file"),
  createTaskValidation,
  taskController.createTask
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  taskController.getAllTasks
);

module.exports = router;