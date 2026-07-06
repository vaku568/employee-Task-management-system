const taskChatService = require("./task-chat.service");

const getMessages = async (req, res) => {
  try {
    const messages = await taskChatService.getMessages(req.params.taskId);

    if (req.query.markRead !== "false") {
      await taskChatService.markMessagesRead(req.params.taskId, req.user.id);
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const filePaths = (req.files || []).map((file) => file.path);

    const message = await taskChatService.sendMessage(
      req.params.taskId,
      req.user.id,
      req.body.receiverId,
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

module.exports = {
  getMessages,
  sendMessage
};
