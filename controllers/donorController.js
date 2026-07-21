const Donor = require('../models/Donor');

/**
 * Donor Controller
 * Handles CRUD operations for blood donor profiles
 */

/**
 * Render become donor page (add/edit form)
 */
exports.getBecomeDonor = async (req, res) => {
  try {
    // Check if user already has a donor profile
    const existingDonor = await Donor.findOne({ userId: req.session.userId });
    
    res.render('become-donor', {
      title: 'Become a Donor - Blood Donor Finder',
      donor: existingDonor,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Error loading donor form:', error);
    req.flash('error', 'An error occurred while loading the form');
    res.redirect('/dashboard');
  }
};

/**
 * Create or update donor profile
 */
exports.postDonorProfile = async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      bloodGroup,
      city,
      contactNumber,
      lastDonationDate,
      availabilityStatus
    } = req.body;

    // Validation
    if (!fullName || !age || !gender || !bloodGroup || !city || !contactNumber || !availabilityStatus) {
      req.flash('error', 'All required fields must be filled');
      return res.redirect('/become-donor');
    }

    // Age validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      req.flash('error', 'Age must be between 18 and 65');
      return res.redirect('/become-donor');
    }

    // Contact number validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(contactNumber)) {
      req.flash('error', 'Please provide a valid contact number (10-15 digits)');
      return res.redirect('/become-donor');
    }

    // Check if user already has a donor profile
    const existingDonor = await Donor.findOne({ userId: req.session.userId });

    if (existingDonor) {
      // Update existing donor profile
      existingDonor.fullName = fullName;
      existingDonor.age = ageNum;
      existingDonor.gender = gender;
      existingDonor.bloodGroup = bloodGroup;
      existingDonor.city = city;
      existingDonor.contactNumber = contactNumber;
      existingDonor.lastDonationDate = lastDonationDate || null;
      existingDonor.availabilityStatus = availabilityStatus;
      
      await existingDonor.save();
      req.flash('success', 'Donor profile updated successfully!');
    } else {
      // Create new donor profile
      await Donor.create({
        userId: req.session.userId,
        fullName,
        age: ageNum,
        gender,
        bloodGroup,
        city,
        contactNumber,
        lastDonationDate: lastDonationDate || null,
        availabilityStatus
      });
      req.flash('success', 'Donor profile created successfully! Thank you for becoming a donor.');
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error saving donor profile:', error);
    req.flash('error', 'An error occurred while saving your profile');
    res.redirect('/become-donor');
  }
};

/**
 * Delete donor profile
 */
exports.deleteDonorProfile = async (req, res) => {
  try {
    await Donor.findOneAndDelete({ userId: req.session.userId });
    req.flash('success', 'Donor profile deleted successfully');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error deleting donor profile:', error);
    req.flash('error', 'An error occurred while deleting your profile');
    res.redirect('/dashboard');
  }
};

/**
 * Search donors by blood group, city, and availability status
 */
exports.searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city, availability } = req.query;
    
    // Server-side validation for blood group
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (bloodGroup && bloodGroup !== '' && !validBloodGroups.includes(bloodGroup)) {
      req.flash('error', 'Invalid blood group selected');
      return res.render('search-donors', {
        title: 'Search Donors - Blood Donor Finder',
        donors: [],
        searchParams: { bloodGroup: '', city: city || '', availability: availability || '' },
        error: req.flash('error'),
        success: req.flash('success')
      });
    }

    // Server-side validation for availability status
    const validAvailability = ['Available', 'Not Available'];
    if (availability && availability !== '' && !validAvailability.includes(availability)) {
      req.flash('error', 'Invalid availability status selected');
      return res.render('search-donors', {
        title: 'Search Donors - Blood Donor Finder',
        donors: [],
        searchParams: { bloodGroup: bloodGroup || '', city: city || '', availability: '' },
        error: req.flash('error'),
        success: req.flash('success')
      });
    }

    // Sanitize city input
    const sanitizedCity = city && city.trim() ? city.trim() : '';
    
    // Build query - start with empty object
    let query = {};
    
    // Add availability filter only if user selected a specific status
    if (availability && availability !== '') {
      query.availabilityStatus = availability;
    }
    
    // Add blood group filter if selected
    if (bloodGroup && bloodGroup !== '') {
      query.bloodGroup = bloodGroup;
    }
    
    // Add city filter if provided (case-insensitive search)
    if (sanitizedCity) {
      query.city = { $regex: sanitizedCity, $options: 'i' };
    }

    const donors = await Donor.find(query).sort({ createdAt: -1 });

    res.render('search-donors', {
      title: 'Search Donors - Blood Donor Finder',
      donors: donors,
      searchParams: { 
        bloodGroup: bloodGroup || '', 
        city: sanitizedCity,
        availability: availability || ''
      },
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Error searching donors:', error);
    req.flash('error', 'An error occurred while searching for donors');
    res.render('search-donors', {
      title: 'Search Donors - Blood Donor Finder',
      donors: [],
      searchParams: { bloodGroup: '', city: '', availability: '' },
      error: req.flash('error'),
      success: req.flash('success')
    });
  }
};

/**
 * Get donor profile for viewing
 */
exports.getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.session.userId });
    
    if (!donor) {
      req.flash('error', 'No donor profile found');
      return res.redirect('/become-donor');
    }

    res.render('donor-profile', {
      title: 'My Donor Profile - Blood Donor Finder',
      donor: donor,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Error loading donor profile:', error);
    req.flash('error', 'An error occurred while loading your profile');
    res.redirect('/dashboard');
  }
};
