const notificationService =
  require("./notification.service");

const createNotification =
  async (req, res) => {
    try {

      const {
        userId,
        title,
        message
      } = req.body;

      const notification =
        await notificationService.createNotification(
          userId,
          title,
          message
        );

      res.status(201).json(
        notification
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

const getNotifications =
  async (req, res) => {
    try {

      const notifications =
        await notificationService.getNotifications(
          req.user.id
        );

      res.status(200).json(
        notifications
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

module.exports = {
  createNotification,
  getNotifications
};