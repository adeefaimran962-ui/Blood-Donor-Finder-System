require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');
const flash = require('connect-flash');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files Configuration
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Flash Messages Configuration
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.userId ? { _id: req.session.userId, name: req.session.userName } : null;
  next();
});

// Import Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donor');
const bloodRequestRoutes = require('./routes/bloodRequest');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');

// Use Routes
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', donorRoutes);
app.use('/', bloodRequestRoutes);
app.use('/', adminRoutes);
app.use('/', profileRoutes);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  
  // Check if user is authenticated
  const isAuthenticated = req.session && req.session.userId;
  
  res.status(err.status || 500).render(isAuthenticated ? 'dashboard' : 'index', {
    title: err.status === 404 ? '404 - Page Not Found' : '500 - Server Error',
    error: err.message || 'Something went wrong',
    user: isAuthenticated ? { _id: req.session.userId, name: req.session.userName } : null
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
