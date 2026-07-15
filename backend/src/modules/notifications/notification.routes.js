const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const notificationController = require("./notification.controller");

// Get all notifications for current user
router.get("/", authMiddleware, notificationController.getNotifications);

// Get unread count
router.get("/unread-count", authMiddleware, notificationController.getUnreadCount);

// Mark notification as read
router.put("/:id/read", authMiddleware, notificationController.markAsRead);

// Mark all notifications as read
router.put("/read-all", authMiddleware, notificationController.markAllAsRead);

// Delete notification
router.delete("/:id", authMiddleware, notificationController.deleteNotification);

module.exports = router;