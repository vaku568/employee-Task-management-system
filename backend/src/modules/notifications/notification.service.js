const Notification = require("../../models/Notification");
const { getIO } = require("../../../socket/socket");
const mongoose = require("mongoose");

const createNotification = async (sender, receiver, title, message, type, relatedId = null) => {
  try {
    console.log("[DEBUG] createNotification - sender:", sender, "receiver:", receiver, "type:", type);
    console.log("[DEBUG] createNotification - sender type:", typeof sender, "receiver type:", typeof receiver);
    console.log("[DEBUG] createNotification - sender string:", String(sender), "receiver string:", String(receiver));

    const notification = await Notification.create({
      sender,
      receiver,
      title,
      message,
      type,
      relatedId
    });

    console.log("[DEBUG] createNotification - Notification created in DB:", notification._id);
    console.log("[DEBUG] createNotification - Notification receiver in DB:", notification.receiver);
    console.log("[DEBUG] createNotification - Notification receiver type in DB:", typeof notification.receiver);
    console.log("[DEBUG] createNotification - Notification receiver string in DB:", String(notification.receiver));

    // Emit socket event for real-time delivery
    try {
      const io = getIO();
      if (io) {
        const receiverRoom = receiver.toString();
        console.log("[DEBUG] createNotification - Emitting to receiver room:", receiverRoom);

        io.to(receiverRoom).emit("newNotification", {
          _id: notification._id,
          sender: notification.sender,
          receiver: notification.receiver,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          relatedId: notification.relatedId,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        });

        console.log("[DEBUG] createNotification - Socket event emitted successfully");
      } else {
        console.error("[DEBUG] createNotification - IO instance not available");
      }
    } catch (socketError) {
      console.error("Error emitting socket event:", socketError);
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

const getNotifications = async (userId) => {
  try {
    console.log("[DEBUG] getNotifications - userId:", userId);
    console.log("[DEBUG] getNotifications - userId type:", typeof userId);
    console.log("[DEBUG] getNotifications - userId string:", String(userId));
    
    // Convert string ID to ObjectId if necessary
    const objectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    console.log("[DEBUG] getNotifications - objectId:", objectId);
    
    const notifications = await Notification.find({ receiver: objectId })
      .populate("sender", "name email employeeId role")
      .sort({ createdAt: -1 });
    
    console.log("[DEBUG] getNotifications - notifications count:", notifications.length);
    console.log("[DEBUG] getNotifications - First notification (if any):", notifications[0] ? {
      _id: notifications[0]._id,
      receiver: notifications[0].receiver,
      receiverString: String(notifications[0].receiver)
    } : "NONE");
    
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

const getUnreadCount = async (userId) => {
  try {
    // Convert string ID to ObjectId if necessary
    const objectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const count = await Notification.countDocuments({
      receiver: objectId,
      isRead: false
    });
    return { unreadCount: count };
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};

const markAsRead = async (notificationId, userId) => {
  try {
    // Convert string ID to ObjectId if necessary
    const objectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, receiver: objectId },
      { isRead: true },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

const markAllAsRead = async (userId) => {
  try {
    // Convert string ID to ObjectId if necessary
    const objectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const result = await Notification.updateMany(
      { receiver: objectId, isRead: false },
      { isRead: true }
    );
    return { modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

const deleteNotification = async (notificationId, userId) => {
  try {
    // Convert string ID to ObjectId if necessary
    const objectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      receiver: objectId
    });
    return notification;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};