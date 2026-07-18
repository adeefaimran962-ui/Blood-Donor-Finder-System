const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');

/**
 * Profile Routes
 * Handles user profile management
 */

// Profile Routes
router.get('/profile', isAuthenticated, profileController.getProfile);
router.post('/profile', isAuthenticated, profileController.updateProfile);

// Change Password Routes
router.get('/change-password', isAuthenticated, profileController.getChangePassword);
router.post('/change-password', isAuthenticated, profileController.changePassword);

module.exports = router;
