const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');

/**
 * Authentication Routes
 * Handles user registration, login, logout, and dashboard access
 */

// Register Routes
router.get('/register', isNotAuthenticated, authController.getRegister);
router.post('/register', isNotAuthenticated, authController.postRegister);

// Login Routes
router.get('/login', isNotAuthenticated, authController.getLogin);
router.post('/login', isNotAuthenticated, authController.postLogin);

// Logout Route
router.get('/logout', isAuthenticated, authController.logout);

// Dashboard Route
router.get('/dashboard', isAuthenticated, authController.getDashboard);

module.exports = router;
