const timetableController = require('../controller/timetableController');
const Timetable = require('../models/Timetable');
const Session = require('../models/Session');
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

jest.mock('../models/Timetable');
jest.mock('../models/Session');
jest.mock('../models/Course');
jest.mock('../models/User');
jest.mock('../models/Enrollment');

describe('timetableController Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTimetable', () => {
    it('should successfully create a timetable', async () => {
      const req = {
        body: {
          course: 'validCourseId',
          courseCoordinator: 'validCoordinatorId',
          semester: 'Year 1 Semester 1'
        }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Course.findById.mockResolvedValue(new Course());
      User.findById.mockResolvedValue(new User());

      Timetable.prototype.save = jest.fn().mockResolvedValue({
        _id: 'newTimetableId',
        ...req.body
      });

      await timetableController.createTimetable(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Timetable created successfully',
        data: expect.anything()
      }));
    });

  });

  describe('deleteTimetable', () => {
    it('should delete a timetable successfully', async () => {
      Timetable.findById.mockResolvedValue({
        _id: 'timetableIdToDelete',
        remove: jest.fn().mockResolvedValue({})
      });

      const req = { params: { id: 'timetableIdToDelete' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await timetableController.deleteTimetable(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Timetable and related sessions deleted successfully'
      });
    });
  });

});
