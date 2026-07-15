const teamChatService = require("./team-chat.service");

const sendMessage = async (req, res) => {
  try {
    const filePaths = (req.files || []).map((file) => file.path);

    const message = await teamChatService.sendMessage(
      req.user.id,
      req.params.receiverId,
      req.body.message,
      filePaths
    );

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const messages = await teamChatService.getConversation(
      req.user.id,
      req.params.employeeId
    );

    if (req.query.markRead !== "false") {
      await teamChatService.markMessagesRead(req.user.id, req.params.employeeId);
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const markMessagesRead = async (req, res) => {
  try {
    await teamChatService.markMessagesRead(req.user.id, req.params.employeeId);
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getAllUsersForChat = async (req, res) => {
  try {
    console.log("[DEBUG] getAllUsersForChat controller - User ID:", req.user.id);
    const users = await teamChatService.getAllUsersForChat(req.user.id);
    console.log("[DEBUG] getAllUsersForChat controller - Returning users:", users.length);
    res.status(200).json(users);
  } catch (error) {
    console.error("[ERROR] getAllUsersForChat:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    console.log("[DEBUG] getUnreadCount controller - User ID:", req.user.id);
    const unreadData = await teamChatService.getUnreadCount(req.user.id);
    console.log("[DEBUG] getUnreadCount controller - Returning unread data:", unreadData);
    res.status(200).json(unreadData);
  } catch (error) {
    console.error("[ERROR] getUnreadCount:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  markMessagesRead,
  getAllUsersForChat,
  getUnreadCount
};
