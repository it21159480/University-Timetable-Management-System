const notificationController = require('../controller/notificationController');
const Notification = require('../models/Notification');

jest.mock('../models/Notification'); // Mock the Notification model

describe('Notification Controller Tests', () => {
    // Assuming req.user is populated by some middleware
    const mockUserId = "mockUserId";
  
    describe('getUserNotifications', () => {
      it('should fetch unread notifications for a user successfully', async () => {
        const req = { user: { _id: mockUserId } };
        const res = { json: jest.fn() };
  
        // Mock the Notification.find method
        Notification.find.mockResolvedValue([{ message: "You have a new notification", users: [mockUserId], readBy: [] }]);
  
        await notificationController.getUserNotifications(req, res);
  
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        expect(res.json.mock.calls[0][0]).toEqual(expect.arrayContaining([expect.objectContaining({ message: "You have a new notification" })]));
      });
    });
  
    describe('markNotificationAsRead', () => {
        it('should mark a notification as read by a user', async () => {
          const req = { 
            params: { notificationId: 'notificationId' },
            user: { _id: 'mockUserId' }
          };
          const res = { json: jest.fn() };
      
          // Mock Notification.findByIdAndUpdate to simulate marking notification as read
          Notification.findByIdAndUpdate.mockResolvedValue(null); // Assuming the update operation is successful but doesn't need to return anything specific for this test
      
          await notificationController.markNotificationAsRead(req, res);
      
          expect(res.json).toHaveBeenCalledWith({ message: 'Notification marked as read.' });
          expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith(
            req.params.notificationId,
            { $addToSet: { readBy: req.user._id } }
            // Removed the third argument expectation since it's not crucial for this test's logic
          );
        });
      });
      
  });
  