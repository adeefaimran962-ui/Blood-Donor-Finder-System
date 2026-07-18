/**
 * Authentication Middleware
 * Protects routes that require user authentication
 */

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  // Store the intended URL for redirect after login
  req.session.returnTo = req.originalUrl;
  
  req.flash('error', 'Please login to access this page');
  return res.redirect('/login');
};

/**
 * Redirect authenticated users away from login/register pages
 */
const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};

/**
 * Admin Middleware
 * Protects routes that require admin privileges
 */
const isAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.session.userId);
    
    if (!user || !user.isAdmin) {
      req.flash('error', 'Access denied. Admin privileges required.');
      return res.redirect('/dashboard');
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    req.flash('error', 'An error occurred while verifying admin privileges');
    res.redirect('/dashboard');
  }
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin
};
