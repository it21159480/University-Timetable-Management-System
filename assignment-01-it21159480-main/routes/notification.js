// In your routes file, e.g., notificationRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const roleCheck = require('../middleware/roleCheck'); // Your role-checking middleware
const notificationController = require('../controller/notificationController');



router.get('/notifications',auth , roleCheck(['Admin','Faculty']), notificationController.getUserNotifications);
router.post('/notifications/:notificationId/read',auth , roleCheck(['Admin','Faculty']), notificationController.markNotificationAsRead);

module.exports = router;
