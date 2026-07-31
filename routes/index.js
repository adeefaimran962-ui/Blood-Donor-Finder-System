const express = require('express');
const router = express.Router();

/**
 * Home Route
 * Renders the main home page
 */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Blood Donor Finder System',
    description: 'Connect blood donors with those in need'
  });
});

/**
 * Blood Compatibility Route
 * Renders the blood compatibility checker page
 */
router.get('/blood-compatibility', (req, res) => {
  res.render('blood-compatibility', {
    title: 'Blood Compatibility Checker - Blood Donor Finder',
    description: 'Check blood group compatibility for donation and transfusion'
  });
});

/**
 * About Us Route
 * Renders the about us page
 */
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us - Blood Donor Finder',
    description: 'Learn about Blood Donor Finder System and our mission to save lives'
  });
});

/**
 * Contact Us Route
 * Renders the contact us page
 */
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Blood Donor Finder',
    description: 'Get in touch with Blood Donor Finder System'
  });
});

/**
 * Contact Form Submission Route
 * Handles contact form submissions
 */
router.post('/contact', (req, res) => {
  const { fullName, email, subject, message } = req.body;
  
  // Server-side validation
  if (!fullName || !email || !subject || !message) {
    req.flash('error', 'All fields are required');
    return res.redirect('/contact');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    req.flash('error', 'Please provide a valid email address');
    return res.redirect('/contact');
  }
  
  // For now, just show success message (no actual email sending)
  req.flash('success', 'Thank you for contacting us! We will get back to you soon.');
  res.redirect('/contact');
});

/**
 * FAQ Route
 * Renders the FAQ page
 */
router.get('/faq', (req, res) => {
  res.render('faq', {
    title: 'FAQ - Blood Donor Finder',
    description: 'Frequently asked questions about Blood Donor Finder System'
  });
});

module.exports = router;
