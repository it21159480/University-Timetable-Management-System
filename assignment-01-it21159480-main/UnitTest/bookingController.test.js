const bookingController = require('../controller/bookingController');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Resource = require('../models/Resource');

jest.mock('../models/Booking');
jest.mock('../models/Room');
jest.mock('../models/Resource');

describe('bookingController Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock for Booking.find to correctly handle populate and exec
    Booking.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([])
    }));

    // Ensure this is adjusted for each test case as needed
  });



  describe('getBookingById', () => {
    it('should fetch a specific booking by ID successfully', async () => {
      const req = { params: { id: 'bookingId' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Booking.findById.mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: req.params.id,
          user: 'userId',
          room: 'roomId',
          resources: [{ resource: 'resourceId', quantity: 1 }],
          startTime: new Date(),
          endTime: new Date(new Date().getTime() + 3600000), // 1 hour later
          purpose: 'Meeting'
        })
      }));

      await bookingController.getBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('deleteBooking', () => {
    it('should delete a booking successfully', async () => {
      const req = { params: { id: 'bookingId' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Booking.findByIdAndDelete.mockResolvedValue({ _id: req.params.id });

      await bookingController.deleteBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking deleted successfully'
      });
    });
  });
});
