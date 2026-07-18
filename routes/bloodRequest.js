const express = require('express');
const router = express.Router();
const bloodRequestController = require('../controllers/bloodRequestController');
const { isAuthenticated } = require('../middleware/auth');

/**
 * Blood Request Routes
 * Handles blood request creation and management
 */

// Blood Request Routes
router.get('/blood-request', isAuthenticated, bloodRequestController.getBloodRequest);
router.post('/blood-request', isAuthenticated, bloodRequestController.postBloodRequest);

// My Requests Routes
router.get('/my-requests', isAuthenticated, bloodRequestController.getMyRequests);
router.post('/blood-request/:id/delete', isAuthenticated, bloodRequestController.deleteBloodRequest);

module.exports = router;
