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

module.exports = router;
