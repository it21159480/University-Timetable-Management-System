// utilities/notificationUtils.js
const Notification = require('../models/Notification');

const createNotification = async (message, userIds) => {
    const newNotification = new Notification({
        message,
        users: userIds,
    });

    await newNotification.save();
};

module.exports = {
    createNotification,
};
