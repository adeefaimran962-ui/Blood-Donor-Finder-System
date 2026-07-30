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

module.exports = router;
