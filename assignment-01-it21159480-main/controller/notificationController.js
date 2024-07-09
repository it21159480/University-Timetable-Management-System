// In notificationController.js
const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
    const userId = req.user._id; // Ensure you have middleware to set req.user
    const notifications = await Notification.find({ users: userId, readBy: { $nin: [userId] } });
    res.json(notifications);
};

exports.markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user._id;
    await Notification.findByIdAndUpdate(notificationId, { $addToSet: { readBy: userId } });
    res.json({ message: 'Notification marked as read.' });
};
