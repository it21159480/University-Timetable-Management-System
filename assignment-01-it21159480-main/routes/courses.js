// routes/courses.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const roleCheck = require('../middleware/roleCheck'); // Your role-checking middleware
const courseController = require('../controller/courseController');

// POST /courses - Create a new course
router.post('/', auth , roleCheck(['Admin']),courseController.createCourse);

// // GET /courses - Get all courses
router.get('/',courseController.getCourses);

// PUT /courses/:id - Update a course
router.put('/:id',auth,roleCheck(['Admin']),courseController.updateCourse);

// // DELETE /courses/:id - Delete a course
router.delete('/:id',auth,roleCheck(['Admin']),courseController.deleteCourse);

router.post('/assignFaculty',auth,roleCheck(['Admin']),courseController.assignFaculty);



module.exports = router;
