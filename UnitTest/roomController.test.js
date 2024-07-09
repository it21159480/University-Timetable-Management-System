const roomController = require('../controller/roomController');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

jest.mock('../models/Room');
jest.mock('../models/Booking');

describe('roomController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

describe('getAllRooms', () => {
    it('should retrieve all rooms successfully', async () => {
      const req = {};
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
      // Adjusted mocking for Room.find to handle populate
      Room.find.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue([])
      }));
  
      await roomController.getAllRooms(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('getRoomById', () => {
    it('should retrieve a specific room by ID successfully', async () => {
      const req = { params: { id: '1' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
      // Adjusted mocking for Room.findById to handle populate
      Room.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: req.params.id,
          roomNumber: '102',
          building: 'Science Wing',
          capacity: 40,
          type: 'lab',
          availableResources: []
        })
      }));
  
      await roomController.getRoomById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: req.params.id,
        roomNumber: '102'
      }));
    });
  });


  describe('deleteRoom', () => {
    it('should not delete a room that has future bookings', async () => {
      const req = { params: { id: '1' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Booking.findOne.mockResolvedValue(true); // Simulate a found booking

      await roomController.deleteRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cannot delete room because it has future bookings.'
      });
    });

    it('should delete a room successfully when no future bookings exist', async () => {
      const req = { params: { id: '2' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Booking.findOne.mockResolvedValue(null); // Simulate no bookings found
      Room.findByIdAndDelete.mockResolvedValue({ _id: req.params.id });

      await roomController.deleteRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Room deleted successfully'
      });
    });
  });
});
