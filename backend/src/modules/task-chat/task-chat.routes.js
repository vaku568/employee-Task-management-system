const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../config/multer");
const taskChatController = require("./task-chat.controller");

router.get("/:taskId", authMiddleware, taskChatController.getMessages);
router.post(
  "/:taskId",
  authMiddleware,
  upload.array("files", 10),
  taskChatController.sendMessage
);

module.exports = router;
