const Notification =
  require("../../models/Notification");

const createNotification =
  async (
    userId,
    title,
    message
  ) => {

    return await Notification.create({
      userId,
      title,
      message
    });
  };

const getNotifications =
  async (userId) => {

    return await Notification.find({
      userId
    }).sort({
      createdAt: -1
    });
  };

module.exports = {
  createNotification,
  getNotifications
};