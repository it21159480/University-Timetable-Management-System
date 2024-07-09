const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const roleCheck = require('../middleware/roleCheck'); // Your role-checking middleware
const timetableController = require('../controller/timetableController');

// POST /api/timetables - Create a new timetable
router.post('/add', auth , roleCheck(['Admin','Faculty']),timetableController.createTimetable);

// GET /api/timetables - Get all timetables
router.get('/veiw', auth , roleCheck(['Admin','Faculty',]),timetableController.getAllTimetables);

// GET /api/timetables/:id - Get a specific timetable by ID
router.get('/veiw/:id', auth , roleCheck(['Admin','Faculty','Student']),timetableController.getTimetableById);

// PUT /api/timetables/:id - Update a specific timetable by ID
router.put('/update/:id',auth , roleCheck(['Admin','Faculty']), timetableController.updateTimetable);

// DELETE /api/timetables/:id - Delete a specific timetable by ID
router.delete('/delete/:id', auth , roleCheck(['Admin','Faculty']),timetableController.deleteTimetable);

module.exports = router;
