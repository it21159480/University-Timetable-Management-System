const sessionController = require('../controller/sessionController');
const Session = require('../models/Session');
const Timetable = require('../models/Timetable');

jest.mock('../models/Session');
jest.mock('../models/Timetable');

describe('sessionController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateSession', () => {
    it('should update a session successfully', async () => {
      const req = {
        params: { id: 'sessionId' },
        body: {
          timetable: 'updatedTimetableId',
          dayOfWeek: 'Tuesday',
          startTime: new Date('2023-03-25T10:00:00Z'),
          endTime: new Date('2023-03-25T12:00:00Z'),
          faculty: 'updatedFacultyId',
          location: 'updatedLocationId',
          sessionType: 'Tutorial',
          description: 'Deep Dive into Testing Strategies'
        }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
      // Simulate the timetable exists
      Timetable.findById.mockResolvedValue(true);
      // Simulate the session exists and can be updated
      Session.findById.mockResolvedValue(true);
      // Simulate the updated session data returned by findByIdAndUpdate
      Session.findByIdAndUpdate.mockResolvedValue({
        _id: req.params.id,
        ...req.body
      });
  
      await sessionController.updateSession(req, res);
  
      // Asserting the response to include the updated session details
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Session updated successfully',
        data: expect.objectContaining({
          _id: req.params.id,
          timetable: 'updatedTimetableId',
          dayOfWeek: 'Tuesday',
          startTime: expect.any(Date),
          endTime: expect.any(Date),
          faculty: 'updatedFacultyId',
          location: 'updatedLocationId',
          sessionType: 'Tutorial',
          description: 'Deep Dive into Testing Strategies'
        })
      }));
    });
  });

  describe('deleteSession', () => {
    it('should delete a session successfully', async () => {
      const req = {
        params: { id: 'sessionId' }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
      Session.findByIdAndDelete.mockResolvedValue(req.params.id);
  
      await sessionController.deleteSession(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Session deleted successfully'
      });
    });
  
    it('should return an error if the session does not exist', async () => {
      const req = {
        params: { id: 'nonexistentSessionId' }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
      Session.findByIdAndDelete.mockResolvedValue(null);
  
      await sessionController.deleteSession(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Session not found'
      });
    });
  });

  describe('getAllSessions', () => {
    it('should retrieve all sessions successfully', async () => {
      const req = {};
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
      Session.find.mockResolvedValue([]);
  
      await sessionController.getAllSessions(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('getSessionById', () => {
    it('should retrieve a specific session by ID successfully', async () => {
      const req = { params: { id: 'sessionId' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockSessionData = {
        _id: req.params.id,
        dayOfWeek: 'Monday',
        startTime: new Date('2023-03-24T09:00:00Z'),
        endTime: new Date('2023-03-24T11:00:00Z'),
        faculty: 'facultyId',
        location: 'locationId',
        sessionType: 'Lecture',
        description: 'Introduction to Testing'
      };

      Session.findById.mockResolvedValue(mockSessionData);

      await sessionController.getSessionById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: req.params.id,
        dayOfWeek: 'Monday',
        startTime: expect.any(Date),
        endTime: expect.any(Date),
        faculty: 'facultyId',
        location: 'locationId',
        sessionType: 'Lecture',
        description: 'Introduction to Testing'
      }));
    });

    it('should return an error if the session does not exist', async () => {
      const req = { params: { id: 'nonexistentSessionId' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Session.findById.mockResolvedValue(null);

      await sessionController.getSessionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Session not found'
      });
    });
});

});
