const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const roleCheck = require('../middleware/roleCheck'); // Your role-checking middleware
const enrollmentController = require('../controller/enrollmentController'); // Adjust the path as necessary

// Route to add a new enrollment
router.post('/add',auth , roleCheck(['Student']), enrollmentController.addEnrollment);

// Route to view enrollments for a specific student
router.get('/enrollments/student/:studentId',auth , roleCheck(['Admin','Faculty']), enrollmentController.getEnrollmentsByStudent);

// Route to update an enrollment status
router.puth('/enrollments/:enrollmentId/status',auth , roleCheck(['Admin','Faculty']), enrollmentController.updateEnrollmentStatus);

// Route to delete an enrollment
router.delete('/enrollments/:enrollmentId',auth , roleCheck(['Admin','Faculty']), enrollmentController.deleteEnrollment);

module.exports = router;
