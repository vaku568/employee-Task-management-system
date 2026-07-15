const TeamChat = require("../../models/TeamChat");
const User = require("../../models/User");
const notificationService = require("../notifications/notification.service");
const { getIO } = require("../../../socket/socket");
const mongoose = require("mongoose");

const sendMessage = async (senderId, receiverId, message, files = []) => {
  console.log("[DEBUG] sendMessage - senderId:", senderId, "receiverId:", receiverId);
  
  // Convert string IDs to ObjectId if necessary
  const senderObjectId = typeof senderId === 'string' ? new mongoose.Types.ObjectId(senderId) : senderId;
  const receiverObjectId = typeof receiverId === 'string' ? new mongoose.Types.ObjectId(receiverId) : receiverId;

  const savedFiles = Array.isArray(files)
    ? files.map((file) => (typeof file === "string" ? file : file.path))
    : typeof files === "string"
    ? [files]
    : [];

  const newMessage = await TeamChat.create({
    senderId: senderObjectId,
    receiverId: receiverObjectId,
    message,
    files: savedFiles
  });

  console.log("[DEBUG] sendMessage - Message saved to DB:", newMessage._id);

  const populatedMessage = await TeamChat.findById(newMessage._id)
    .populate("senderId", "name role")
    .populate("receiverId", "name role");

  console.log("[DEBUG] sendMessage - Populated message:", {
    senderId: populatedMessage.senderId._id,
    senderRole: populatedMessage.senderId.role,
    receiverId: populatedMessage.receiverId._id,
    receiverRole: populatedMessage.receiverId.role
  });

  // Create notification for the receiver
  try {
    console.log("[DEBUG] sendMessage - Creating notification for receiver:", receiverObjectId);
    const notification = await notificationService.createNotification(
      senderObjectId,
      receiverObjectId,
      "New Message",
      message,
      "NEW_MESSAGE",
      newMessage._id
    );
    console.log("[DEBUG] sendMessage - Notification created:", notification._id);
  } catch (notificationError) {
    console.error("Error creating notification:", notificationError);
  }

  // Emit socket event for real-time delivery
  try {
    const io = getIO();
    if (io) {
      const receiverRoom = receiverObjectId.toString();
      const senderRoom = senderObjectId.toString();

      console.log("[DEBUG] sendMessage - Emitting to receiver room:", receiverRoom);
      console.log("[DEBUG] sendMessage - Emitting to sender room:", senderRoom);

      io.to(receiverRoom).emit("newMessage", {
        _id: populatedMessage._id,
        senderId: populatedMessage.senderId._id,
        receiverId: populatedMessage.receiverId._id,
        message: populatedMessage.message,
        files: populatedMessage.files,
        isRead: populatedMessage.isRead,
        createdAt: populatedMessage.createdAt,
      });

      // Also emit to sender for confirmation
      io.to(senderRoom).emit("messageSent", {
        _id: populatedMessage._id,
        receiverId: populatedMessage.receiverId._id,
        message: populatedMessage.message,
        files: populatedMessage.files,
        createdAt: populatedMessage.createdAt,
      });

      console.log("[DEBUG] sendMessage - Socket events emitted successfully");
    } else {
      console.error("[DEBUG] sendMessage - IO instance not available");
    }
  } catch (error) {
    console.error("Error emitting socket event:", error);
  }

  return populatedMessage;
};

const getConversation = async (currentUserId, employeeId) => {
  // Convert string IDs to ObjectId if necessary
  const currentObjectId = typeof currentUserId === 'string' ? new mongoose.Types.ObjectId(currentUserId) : currentUserId;
  const employeeObjectId = typeof employeeId === 'string' ? new mongoose.Types.ObjectId(employeeId) : employeeId;
  
  return await TeamChat.find({
    $or: [
      { senderId: currentObjectId, receiverId: employeeObjectId },
      { senderId: employeeObjectId, receiverId: currentObjectId }
    ]
  })
    .populate("senderId", "name role")
    .populate("receiverId", "name role")
    .sort({ createdAt: 1 });
};

const markMessagesRead = async (currentUserId, employeeId) => {
  // Convert string IDs to ObjectId if necessary
  const currentObjectId = typeof currentUserId === 'string' ? new mongoose.Types.ObjectId(currentUserId) : currentUserId;
  const employeeObjectId = typeof employeeId === 'string' ? new mongoose.Types.ObjectId(employeeId) : employeeId;
  
  return await TeamChat.updateMany(
    {
      senderId: employeeObjectId,
      receiverId: currentObjectId,
      isRead: false
    },
    {
      $set: {
        isRead: true
      }
    }
  );
};

const getAllUsersForChat = async (currentUserId) => {
  console.log("[DEBUG] getAllUsersForChat - Current user ID:", currentUserId);

  // Convert string ID to ObjectId if necessary
  const currentObjectId = typeof currentUserId === 'string' ? new mongoose.Types.ObjectId(currentUserId) : currentUserId;

  const users = await User.find({
    _id: { $ne: currentObjectId },
    status: "APPROVED"
  })
    .select("name email employeeId role team status")
    .sort({ role: 1, name: 1 });

  console.log("[DEBUG] getAllUsersForChat - Found users:", users.length);

  return users;
};

const getUnreadCount = async (currentUserId) => {
  console.log("[DEBUG] getUnreadCount - Current user ID:", currentUserId);

  // Convert string ID to ObjectId if necessary
  const currentObjectId = typeof currentUserId === 'string' ? new mongoose.Types.ObjectId(currentUserId) : currentUserId;

  const unreadMessages = await TeamChat.find({
    receiverId: currentObjectId,
    isRead: false
  });

  const totalUnread = unreadMessages.length;

  const chatCounts = {};
  unreadMessages.forEach((msg) => {
    const senderId = String(msg.senderId);
    chatCounts[senderId] = (chatCounts[senderId] || 0) + 1;
  });

  console.log("[DEBUG] getUnreadCount - Total unread:", totalUnread);
  console.log("[DEBUG] getUnreadCount - Chat counts:", chatCounts);

  return {
    totalUnread,
    chatCounts
  };
};

module.exports = {
  sendMessage,
  getConversation,
  markMessagesRead,
  getAllUsersForChat,
  getUnreadCount
};
