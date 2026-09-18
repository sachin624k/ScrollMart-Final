const Notification = require("../models/Notification");

const createNotification = async ({
  recipientId,
  type,
  title,
  message,
  relatedId = null,
}) => {
  try {
    await Notification.create({
      recipientId,
      type,
      title,
      message,
      relatedId,
    });
  } catch (error) {
    console.error("Notification creation error:", error);
  }
};

module.exports = createNotification;
