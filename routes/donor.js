const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { isAuthenticated } = require('../middleware/auth');

/**
 * Donor Routes
 * Handles donor profile management and search functionality
 */

// Become Donor Routes (Create/Update)
router.get('/become-donor', isAuthenticated, donorController.getBecomeDonor);
router.post('/become-donor', isAuthenticated, donorController.postDonorProfile);

// Donor Profile Routes
router.get('/donor-profile', isAuthenticated, donorController.getDonorProfile);
router.post('/donor-profile/delete', isAuthenticated, donorController.deleteDonorProfile);

// Search Donors Route
router.get('/search-donors', donorController.searchDonors);

module.exports = router;
