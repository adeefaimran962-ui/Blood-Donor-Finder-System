const User = require('../models/User');
const Donor = require('../models/Donor');

/**
 * Profile Controller
 * Handles user profile management operations
 */

/**
 * Render user profile page
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const donorProfile = await Donor.findOne({ userId: req.session.userId });
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/dashboard');
    }

    res.render('profile', {
      title: 'My Profile - Blood Donor Finder',
      user: user,
      donorProfile: donorProfile,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Profile error:', error);
    req.flash('error', 'An error occurred while loading your profile');
    res.redirect('/dashboard');
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, city, bloodGroup } = req.body;

    // Validation
    if (!fullName || !phone || !city || !bloodGroup) {
      req.flash('error', 'All required fields must be filled');
      return res.redirect('/profile');
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      req.flash('error', 'Please provide a valid phone number (10-15 digits)');
      return res.redirect('/profile');
    }

    // Update user
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/profile');
    }

    user.fullName = fullName;
    user.phone = phone;
    user.city = city;
    user.bloodGroup = bloodGroup;
    await user.save();

    // Update donor profile if exists
    const donorProfile = await Donor.findOne({ userId: req.session.userId });
    if (donorProfile) {
      donorProfile.fullName = fullName;
      donorProfile.city = city;
      donorProfile.bloodGroup = bloodGroup;
      donorProfile.contactNumber = phone;
      await donorProfile.save();
    }

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (error) {
    console.error('Update profile error:', error);
    req.flash('error', 'An error occurred while updating your profile');
    res.redirect('/profile');
  }
};

/**
 * Render change password page
 */
exports.getChangePassword = (req, res) => {
  res.render('change-password', {
    title: 'Change Password - Blood Donor Finder',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      req.flash('error', 'All fields are required');
      return res.redirect('/change-password');
    }

    if (newPassword !== confirmPassword) {
      req.flash('error', 'New password and confirm password do not match');
      return res.redirect('/change-password');
    }

    if (newPassword.length < 8) {
      req.flash('error', 'New password must be at least 8 characters');
      return res.redirect('/change-password');
    }

    // Get user with password
    const user = await User.findById(req.session.userId).select('+password');
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/change-password');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      req.flash('error', 'Current password is incorrect');
      return res.redirect('/change-password');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    req.flash('success', 'Password changed successfully!');
    res.redirect('/profile');
  } catch (error) {
    console.error('Change password error:', error);
    req.flash('error', 'An error occurred while changing your password');
    res.redirect('/change-password');
  }
};
