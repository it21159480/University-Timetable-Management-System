const courseController = require('../controller/courseController');
const Course = require('../models/Course');
const User = require('../models/User');

jest.mock('../models/Course');
jest.mock('../models/User');

describe('courseController Tests', () => {

  describe('updateCourse', () => {
    it('should update a course successfully', async () => {
      const req = {
        params: { id: 'courseId' },
        body: {
          name: 'Updated Course Name',
          description: 'Updated Description',
          credits: 5
        }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Course.findById.mockResolvedValue(true);
      Course.findByIdAndUpdate.mockResolvedValue({
        _id: req.params.id,
        ...req.body
      });

      await courseController.updateCourse(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Course updated successfully',
        updatedCourse: expect.anything()
      }));
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course successfully', async () => {
      const req = { params: { id: 'courseId' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Course.findByIdAndDelete.mockResolvedValue(req.params);

      await courseController.deleteCourse(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Course deleted successfully'
      });
    });
  });

  describe('assignFaculty', () => {
    it('should assign a faculty to a course successfully', async () => {
      const req = {
        body: {
          code: 'CS101',
          username: 'facultyUser'
        }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      User.findOne.mockResolvedValue({ _id: 'facultyId', username: req.body.username });
      Course.findOne.mockResolvedValue({
        code: req.body.code,
        save: jest.fn().mockResolvedValue({
          ...req.body,
          faculty: 'facultyId'
        })
      });

      await courseController.assignFaculty(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Faculty assigned successfully',
        course: expect.anything()
      }));
    });
  });

  describe('getCourses', () => {
    it('should fetch all courses successfully', async () => {
      const req = {};
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Course.find.mockResolvedValue([]);

      await courseController.getCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });
});
