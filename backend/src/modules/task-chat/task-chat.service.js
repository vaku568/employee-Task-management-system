const TaskMessage = require("../../models/TaskMessage");

const getMessages = async (taskId) => {
  return await TaskMessage.find({
    taskId
  })
    .populate("senderId", "name role")
    .populate("receiverId", "name role")
    .sort({ createdAt: 1 });
};

const markMessagesRead = async (taskId, userId) => {
  return await TaskMessage.updateMany(
    {
      taskId,
      receiverId: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true
      }
    }
  );
};

const sendMessage = async (taskId, senderId, receiverId, message, files = []) => {
  if (!receiverId) {
    throw new Error("receiverId is required");
  }

  const savedFiles = Array.isArray(files)
    ? files.map((file) => (typeof file === "string" ? file : file.path))
    : typeof files === "string"
    ? [files]
    : [];

  const newMessage = await TaskMessage.create({
    taskId,
    senderId,
    receiverId,
    message,
    files: savedFiles
  });

  return await TaskMessage.findById(newMessage._id)
    .populate("senderId", "name role")
    .populate("receiverId", "name role");
};

module.exports = {
  getMessages,
  markMessagesRead,
  sendMessage
};
