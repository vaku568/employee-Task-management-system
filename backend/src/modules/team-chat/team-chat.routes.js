const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../config/multer");
const teamChatController = require("./team-chat.controller");

router.post(
  "/:receiverId",
  authMiddleware,
  upload.array("files", 10),
  teamChatController.sendMessage
);

router.get(
  "/conversation/:employeeId",
  authMiddleware,
  teamChatController.getConversation
);

router.put(
  "/read/:employeeId",
  authMiddleware,
  teamChatController.markMessagesRead
);

router.get(
  "/users",
  authMiddleware,
  teamChatController.getAllUsersForChat
);

router.get(
  "/unread-count",
  authMiddleware,
  teamChatController.getUnreadCount
);

module.exports = router;
