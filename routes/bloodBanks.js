const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

/**
 * Blood Banks Routes
 * Handles blood bank listing and search functionality
 */

// Sample blood banks data
const bloodBanksData = [
  {
    id: 1,
    name: "City General Blood Bank",
    address: "123 Main Street, Medical District",
    city: "New York",
    state: "NY",
    contactNumber: "555-0101",
    email: "info@citybloodbank.com",
    openingHours: "24/7",
    isOpen: true,
    services: ["Blood Collection", "Blood Testing", "Blood Storage", "Emergency Services"],
    website: "https://citybloodbank.com",
    emergencyContact: "555-0911"
  },
  {
    id: 2,
    name: "Metro Community Blood Center",
    address: "456 Health Avenue, Downtown",
    city: "New York",
    state: "NY",
    contactNumber: "555-0202",
    email: "contact@metrobc.org",
    openingHours: "8:00 AM - 6:00 PM",
    isOpen: true,
    services: ["Blood Donation", "Platelet Collection", "Plasma Collection"],
    website: "https://metrobc.org",
    emergencyContact: "555-0922"
  },
  {
    id: 3,
    name: "Regional Medical Blood Bank",
    address: "789 Care Boulevard, Medical Campus",
    city: "Los Angeles",
    state: "CA",
    contactNumber: "555-0303",
    email: "info@regionalblood.com",
    openingHours: "6:00 AM - 10:00 PM",
    isOpen: true,
    services: ["Blood Banking", "Component Preparation", "Cross Matching"],
    website: "https://regionalblood.com",
    emergencyContact: "555-0933"
  },
  {
    id: 4,
    name: "Community Health Blood Services",
    address: "321 Wellness Drive, Suburb Area",
    city: "Chicago",
    state: "IL",
    contactNumber: "555-0404",
    email: "help@chbs.org",
    openingHours: "7:00 AM - 8:00 PM",
    isOpen: false,
    services: ["Blood Collection", "Donor Screening", "Blood Distribution"],
    website: "https://chbs.org",
    emergencyContact: "555-0944"
  },
  {
    id: 5,
    name: "University Hospital Blood Bank",
    address: "654 Academic Circle, University District",
    city: "Boston",
    state: "MA",
    contactNumber: "555-0505",
    email: "bloodbank@university.edu",
    openingHours: "24/7",
    isOpen: true,
    services: ["Research Blood Banking", "Student Training", "Clinical Services"],
    website: "https://university.edu/bloodbank",
    emergencyContact: "555-0955"
  },
  {
    id: 6,
    name: "Central Blood Collection Center",
    address: "987 Donation Street, Central District",
    city: "Houston",
    state: "TX",
    contactNumber: "555-0606",
    email: "donations@centralbc.com",
    openingHours: "9:00 AM - 7:00 PM",
    isOpen: true,
    services: ["Mobile Blood Drives", "Corporate Donations", "Special Events"],
    website: "https://centralbc.com",
    emergencyContact: "555-0966"
  },
  {
    id: 7,
    name: "Emergency Blood Services",
    address: "147 Urgent Care Lane, Medical Plaza",
    city: "Miami",
    state: "FL",
    contactNumber: "555-0707",
    email: "emergency@ebs.org",
    openingHours: "24/7",
    isOpen: true,
    services: ["Emergency Blood Supply", "Trauma Support", "Critical Care"],
    website: "https://ebs.org",
    emergencyContact: "555-0977"
  },
  {
    id: 8,
    name: "Suburban Blood Bank",
    address: "258 Family Road, Residential Area",
    city: "Phoenix",
    state: "AZ",
    contactNumber: "555-0808",
    email: "info@suburbanbb.net",
    openingHours: "8:00 AM - 5:00 PM",
    isOpen: false,
    services: ["Family Donations", "Pediatric Services", "Genetic Testing"],
    website: "https://suburbanbb.net",
    emergencyContact: "555-0988"
  }
];

/**
 * Get Blood Banks Page
 */
exports.getBloodBanks = (req, res) => {
  try {
    const { search, city, status } = req.query;
    let filteredBanks = [...bloodBanksData];
    
    // Apply search filter
    if (search && search.trim() !== '') {
      const searchTerm = search.trim().toLowerCase();
      filteredBanks = filteredBanks.filter(bank => 
        bank.name.toLowerCase().includes(searchTerm) ||
        bank.city.toLowerCase().includes(searchTerm) ||
        bank.address.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply city filter
    if (city && city.trim() !== '') {
      const cityTerm = city.trim().toLowerCase();
      filteredBanks = filteredBanks.filter(bank => 
        bank.city.toLowerCase().includes(cityTerm)
      );
    }
    
    // Apply status filter
    if (status && status !== 'all') {
      if (status === 'open') {
        filteredBanks = filteredBanks.filter(bank => bank.isOpen);
      } else if (status === 'closed') {
        filteredBanks = filteredBanks.filter(bank => !bank.isOpen);
      }
    }
    
    // Get unique cities for dropdown
    const cities = [...new Set(bloodBanksData.map(bank => bank.city))].sort();
    
    res.render('blood-banks', {
      title: 'Nearby Blood Banks',
      bloodBanks: filteredBanks,
      cities: cities,
      searchParams: {
        search: search || '',
        city: city || '',
        status: status || 'all'
      },
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Error loading blood banks:', error);
    req.flash('error', 'An error occurred while loading blood banks');
    res.redirect('/dashboard');
  }
};

/**
 * Get Blood Bank Details (API endpoint for modal)
 */
exports.getBloodBankDetails = (req, res) => {
  try {
    const bankId = parseInt(req.params.id);
    const bank = bloodBanksData.find(b => b.id === bankId);
    
    if (!bank) {
      return res.status(404).json({ error: 'Blood bank not found' });
    }
    
    res.json(bank);
  } catch (error) {
    console.error('Error loading blood bank details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Routes
router.get('/blood-banks', exports.getBloodBanks);
router.get('/api/blood-bank/:id', exports.getBloodBankDetails);

module.exports = router;