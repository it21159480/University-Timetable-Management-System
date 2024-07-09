const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const roleCheck = require('../middleware/roleCheck'); // Your role-checking middleware
const roomController = require('../controller/roomController');

router.post('/add',auth , roleCheck(['Admin']) ,roomController.createRoom);
router.get('/view',auth , roleCheck(['Admin','Faculty']),  roomController.getAllRooms);
router.get('/view/:id',auth , roleCheck(['Admin','Faculty']),  roomController.getRoomById);
router.put('/update/:id',auth , roleCheck(['Admin']), roomController.updateRoom);
router.delete('/delete/:id',auth , roleCheck(['Admin']), roomController.deleteRoom);

module.exports = router;
