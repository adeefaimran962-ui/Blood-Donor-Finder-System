const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');

/**
 * Admin Controller
 * Handles admin dashboard and management operations
 */

/**
 * Render admin dashboard
 */
exports.getAdminDashboard = async (req, res) => {
  try {
    // Get statistics
    const totalUsers = await User.countDocuments();
    const totalDonors = await Donor.countDocuments();
    const totalBloodRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ status: 'Pending' });
    const approvedRequests = await BloodRequest.countDocuments({ status: 'Approved' });
    const completedRequests = await BloodRequest.countDocuments({ status: 'Completed' });

    // Get recent data
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentDonors = await Donor.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'fullName email');
    const recentRequests = await BloodRequest.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'fullName email');

    res.render('admin/dashboard', {
      title: 'Admin Dashboard - Blood Donor Finder',
      stats: {
        totalUsers,
        totalDonors,
        totalBloodRequests,
        pendingRequests,
        approvedRequests,
        completedRequests
      },
      recentUsers,
      recentDonors,
      recentRequests,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    req.flash('error', 'An error occurred while loading the dashboard');
    res.redirect('/dashboard');
  }
};

/**
 * Render users management page
 */
exports.getManageUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.render('admin/users', {
      title: 'Manage Users - Admin',
      users: users,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Manage users error:', error);
    req.flash('error', 'An error occurred while loading users');
    res.redirect('/admin/dashboard');
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent deleting admin themselves
    if (userId === req.session.userId) {
      req.flash('error', 'You cannot delete your own account');
      return res.redirect('/admin/users');
    }

    // Delete associated donor profile and blood requests
    await Donor.deleteMany({ userId: userId });
    await BloodRequest.deleteMany({ userId: userId });
    await User.findByIdAndDelete(userId);

    req.flash('success', 'User and associated data deleted successfully');
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Delete user error:', error);
    req.flash('error', 'An error occurred while deleting the user');
    res.redirect('/admin/users');
  }
};

/**
 * Toggle user admin status
 */
exports.toggleAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent toggling admin status of themselves
    if (userId === req.session.userId) {
      req.flash('error', 'You cannot change your own admin status');
      return res.redirect('/admin/users');
    }

    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/admin/users');
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    req.flash('success', `User admin status updated successfully`);
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Toggle admin error:', error);
    req.flash('error', 'An error occurred while updating admin status');
    res.redirect('/admin/users');
  }
};

/**
 * Render donors management page
 */
exports.getManageDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 }).populate('userId', 'fullName email');

    res.render('admin/donors', {
      title: 'Manage Donors - Admin',
      donors: donors,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Manage donors error:', error);
    req.flash('error', 'An error occurred while loading donors');
    res.redirect('/admin/dashboard');
  }
};

/**
 * Delete donor
 */
exports.deleteDonor = async (req, res) => {
  try {
    const donorId = req.params.id;
    await Donor.findByIdAndDelete(donorId);

    req.flash('success', 'Donor profile deleted successfully');
    res.redirect('/admin/donors');
  } catch (error) {
    console.error('Delete donor error:', error);
    req.flash('error', 'An error occurred while deleting the donor');
    res.redirect('/admin/donors');
  }
};

/**
 * Render blood requests management page
 */
exports.getManageRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 }).populate('userId', 'fullName email');

    res.render('admin/requests', {
      title: 'Manage Blood Requests - Admin',
      requests: requests,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Manage requests error:', error);
    req.flash('error', 'An error occurred while loading requests');
    res.redirect('/admin/dashboard');
  }
};

/**
 * Update blood request status
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Completed', 'Rejected'].includes(status)) {
      req.flash('error', 'Invalid status');
      return res.redirect('/admin/requests');
    }

    const request = await BloodRequest.findById(requestId);
    if (!request) {
      req.flash('error', 'Request not found');
      return res.redirect('/admin/requests');
    }

    request.status = status;
    await request.save();

    req.flash('success', 'Request status updated successfully');
    res.redirect('/admin/requests');
  } catch (error) {
    console.error('Update request status error:', error);
    req.flash('error', 'An error occurred while updating request status');
    res.redirect('/admin/requests');
  }
};

/**
 * Delete blood request
 */
exports.deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    await BloodRequest.findByIdAndDelete(requestId);

    req.flash('success', 'Blood request deleted successfully');
    res.redirect('/admin/requests');
  } catch (error) {
    console.error('Delete request error:', error);
    req.flash('error', 'An error occurred while deleting the request');
    res.redirect('/admin/requests');
  }
};
