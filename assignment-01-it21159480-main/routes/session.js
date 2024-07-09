const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const roleCheck = require('../middleware/roleCheck'); // Your role-checking middleware
const sessionController = require('../controller/sessionController');

// POST /api/sessions - Create a new session
router.post('/add',auth , roleCheck(['Admin','Faculty']), sessionController.createSession);

// GET /api/sessions - Get all sessions
router.get('/veiw', sessionController.getAllSessions);

// GET /api/sessions/:id - Get a specific session by ID
router.get('/veiw/:id', sessionController.getSessionById);

// PUT /api/sessions/:id - Update a specific session by ID
router.put('/update/:id',auth , roleCheck(['Admin','Faculty']), sessionController.updateSession);

// DELETE /api/sessions/:id - Delete a specific session by ID
router.delete('/delete/:id',auth , roleCheck(['Admin','Faculty']), sessionController.deleteSession);

// Additional routes for any other functionalities

module.exports = router;
