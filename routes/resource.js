const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const roleCheck = require('../middleware/roleCheck'); // Your role-checking middleware
const resourceController = require('../controller/resourceController');

router.post('/add',auth , roleCheck(['Admin']) ,resourceController.createResource);
router.get('/view',auth , roleCheck(['Admin','Faculty']),  resourceController.getAllResources);
router.get('/view/:id',auth , roleCheck(['Admin','Faculty']),  resourceController.getResourceById);
router.put('/update/:id',auth , roleCheck(['Admin']), resourceController.updateResource);
router.delete('/delete/:id',auth , roleCheck(['Admin']), resourceController.deleteResource);

module.exports = router;
