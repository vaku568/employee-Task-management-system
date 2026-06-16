const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const notificationController =
  require("./notification.controller");

router.get(
  "/",
  authMiddleware,
  notificationController.getNotifications
);

router.post(
  "/",
  authMiddleware,
  notificationController.createNotification
);

module.exports = router;