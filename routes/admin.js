const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

/**
 * Admin Routes
 * Handles admin dashboard and management operations
 */

// Admin Dashboard
router.get('/admin/dashboard', isAuthenticated, isAdmin, adminController.getAdminDashboard);

// Users Management
router.get('/admin/users', isAuthenticated, isAdmin, adminController.getManageUsers);
router.post('/admin/users/:id/delete', isAuthenticated, isAdmin, adminController.deleteUser);
router.post('/admin/users/:id/toggle-admin', isAuthenticated, isAdmin, adminController.toggleAdmin);

// Donors Management
router.get('/admin/donors', isAuthenticated, isAdmin, adminController.getManageDonors);
router.post('/admin/donors/:id/delete', isAuthenticated, isAdmin, adminController.deleteDonor);

// Blood Requests Management
router.get('/admin/requests', isAuthenticated, isAdmin, adminController.getManageRequests);
router.post('/admin/requests/:id/update-status', isAuthenticated, isAdmin, adminController.updateRequestStatus);
router.post('/admin/requests/:id/delete', isAuthenticated, isAdmin, adminController.deleteRequest);

module.exports = router;
