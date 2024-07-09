jest.mock('../models/Enrollment');
jest.mock('../models/Course');
jest.mock('../models/User');

const enrollmentController = require('../controller/enrollmentController');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

describe('enrollmentController Tests', () => {
  describe('addEnrollment', () => {
    it('should add an enrollment successfully', async () => {
      const req = {
        body: {
          student: 'validStudentId',
          course: 'validCourseId'
        }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      // Mock User.findById to simulate finding a student
      User.findById.mockResolvedValue({ _id: req.body.student });

      // Mock Course.findById to simulate finding a course and include a mock save function
      Course.findById.mockResolvedValue({
        _id: req.body.course,
        enrolledStudents: [],
        save: jest.fn().mockResolvedValue({}) // Ensure save is mocked
      });

      Enrollment.prototype.save = jest.fn().mockResolvedValue({
        _id: 'newEnrollmentId',
        student: req.body.student,
        course: req.body.course
      });

      await enrollmentController.addEnrollment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Enrollment successfully added',
        data: expect.anything()
      }));
    });

    // Test for the scenario where the student is already enrolled in the course
    it('should not add an enrollment if the student is already enrolled', async () => {
      const req = {
        body: {
          student: 'validStudentId',
          course: 'validCourseId'
        }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      // Mock the course finding to simulate an already enrolled student
      Course.findById.mockResolvedValue({ _id: req.body.course, enrolledStudents: [req.body.student] });

      await enrollmentController.addEnrollment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Student already enrolled'
      });
    });

    // Test for the scenario where the course or student does not exist
    it('should return a 404 if the course or student does not exist', async () => {
      const req = {
        body: {
          student: 'nonexistentStudentId',
          course: 'nonexistentCourseId'
        }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      // Simulate that neither the course nor the student exists
      User.findById.mockResolvedValue(null);
      Course.findById.mockResolvedValue(null);

      await enrollmentController.addEnrollment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Course or Student not found'
      });
    });
  });

  describe('updateEnrollmentStatus', () => {
    it('should update enrollment status successfully', async () => {
      const req = {
        body: {
          enrollmentId: 'enrollmentId',
          status: 'completed'
        }
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Enrollment.findByIdAndUpdate.mockResolvedValue({
        _id: req.body.enrollmentId,
        status: req.body.status
      });

      await enrollmentController.updateEnrollmentStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Enrollment status updated successfully',
        data: expect.anything()
      }));
    });

  });

  describe('deleteEnrollment', () => {
    it('should remove an enrollment successfully', async () => {
      const req = { params: { enrollmentId: 'enrollmentId' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Enrollment.findById.mockResolvedValue({
        _id: 'enrollmentId',
        course: 'courseId',
        student: 'studentId'
      });
      Course.findById.mockResolvedValue({
        _id: 'courseId',
        enrolledStudents: ['studentId'],
        save: jest.fn().mockResolvedValue({})
      });
      Enrollment.findByIdAndDelete.mockResolvedValue({});

      await enrollmentController.deleteEnrollment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Enrollment successfully removed'
      });
    });

  });
});
