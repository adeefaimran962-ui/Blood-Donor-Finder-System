const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');

/**
 * Authentication Controller
 * Handles user registration, login, and logout operations
 */

/**
 * Render registration page
 */
exports.getRegister = (req, res) => {
  res.render('register', {
    title: 'Register - Blood Donor Finder',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

/**
 * Handle user registration
 */
exports.postRegister = async (req, res) => {
  try {
    const { fullName, email, phone, city, bloodGroup, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !phone || !city || !bloodGroup || !password || !confirmPassword) {
      req.flash('error', 'All fields are required');
      return res.redirect('/register');
    }

    // Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      req.flash('error', 'Please provide a valid email address');
      return res.redirect('/register');
    }

    // Password length validation
    if (password.length < 8) {
      req.flash('error', 'Password must be at least 8 characters');
      return res.redirect('/register');
    }

    // Password match validation
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/register');
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      req.flash('error', 'Please provide a valid phone number (10-15 digits)');
      return res.redirect('/register');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already registered. Please login instead.');
      return res.redirect('/register');
    }

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      phone,
      city,
      bloodGroup,
      password
    });

    // Set session
    req.session.userId = newUser._id;
    req.session.userName = newUser.fullName;

    req.flash('success', 'Registration successful! Welcome to Blood Donor Finder.');
    return res.redirect('/dashboard');

  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', 'An error occurred during registration. Please try again.');
    return res.redirect('/register');
  }
};

/**
 * Render login page
 */
exports.getLogin = (req, res) => {
  res.render('login', {
    title: 'Login - Blood Donor Finder',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

/**
 * Handle user login
 */
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      req.flash('error', 'Email and password are required');
      return res.redirect('/login');
    }

    // Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      req.flash('error', 'Please provide a valid email address');
      return res.redirect('/login');
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    // Set session
    req.session.userId = user._id;
    req.session.userName = user.fullName;

    req.flash('success', 'Login successful! Welcome back.');
    
    // Redirect to intended URL or dashboard
    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    return res.redirect(returnTo);

  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'An error occurred during login. Please try again.');
    return res.redirect('/login');
  }
};

/**
 * Handle user logout
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/dashboard');
    }
    
    res.clearCookie('connect.sid');
    req.flash('success', 'You have been logged out successfully');
    res.redirect('/');
  });
};

/**
 * Render dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/login');
    }

    // Get statistics
    const totalDonors = await Donor.countDocuments();
    const totalBloodRequests = await BloodRequest.countDocuments();
    const userDonorProfile = await Donor.findOne({ userId: req.session.userId });
    const userRequests = await BloodRequest.find({ userId: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent blood requests (all users)
    const recentRequests = await BloodRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName');

    res.render('dashboard', {
      title: 'Dashboard - Blood Donor Finder',
      user: user,
      donorProfile: userDonorProfile,
      stats: {
        totalDonors,
        totalBloodRequests
      },
      userRequests,
      recentRequests,
      error: req.flash('error'),
      success: req.flash('success')
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'An error occurred while loading the dashboard');
    res.redirect('/login');
  }
};
