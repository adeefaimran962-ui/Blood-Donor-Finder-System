const BloodRequest = require('../models/BloodRequest');

/**
 * Blood Request Controller
 * Handles CRUD operations for blood requests
 */

/**
 * Render blood request form
 */
exports.getBloodRequest = (req, res) => {
  res.render('blood-request', {
    title: 'Blood Request - Blood Donor Finder',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

/**
 * Create blood request
 */
exports.postBloodRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroupRequired,
      hospitalName,
      city,
      requiredDate,
      contactNumber,
      additionalNotes
    } = req.body;

    // Validation
    if (!patientName || !bloodGroupRequired || !hospitalName || !city || !requiredDate || !contactNumber) {
      req.flash('error', 'All required fields must be filled');
      return res.redirect('/blood-request');
    }

    // Contact number validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(contactNumber)) {
      req.flash('error', 'Please provide a valid contact number (10-15 digits)');
      return res.redirect('/blood-request');
    }

    // Date validation
    const requiredDateObj = new Date(requiredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (requiredDateObj < today) {
      req.flash('error', 'Required date must be today or in the future');
      return res.redirect('/blood-request');
    }

    // Create blood request
    await BloodRequest.create({
      userId: req.session.userId,
      patientName,
      bloodGroupRequired,
      hospitalName,
      city,
      requiredDate: requiredDateObj,
      contactNumber,
      additionalNotes: additionalNotes || ''
    });

    req.flash('success', 'Blood request submitted successfully!');
    res.redirect('/my-requests');
  } catch (error) {
    console.error('Error creating blood request:', error);
    req.flash('error', 'An error occurred while submitting your request');
    res.redirect('/blood-request');
  }
};

/**
 * View user's blood requests
 */
exports.getMyRequests = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build query
    let query = { userId: req.session.userId };
    
    // Add status filter if provided
    if (status && status !== '') {
      const validStatuses = ['Pending', 'Approved', 'Completed', 'Rejected'];
      if (validStatuses.includes(status)) {
        query.status = status;
      }
    }

    const requests = await BloodRequest.find(query).sort({ createdAt: -1 });

    res.render('my-requests', {
      title: 'My Blood Requests - Blood Donor Finder',
      requests: requests,
      searchParams: { status: status || '' },
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Error loading blood requests:', error);
    req.flash('error', 'An error occurred while loading your requests');
    res.redirect('/dashboard');
  }
};

/**
 * Delete blood request
 */
exports.deleteBloodRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    
    // Verify the request belongs to the user
    const request = await BloodRequest.findOne({ _id: requestId, userId: req.session.userId });
    
    if (!request) {
      req.flash('error', 'Request not found or you do not have permission to delete it');
      return res.redirect('/my-requests');
    }

    await BloodRequest.findByIdAndDelete(requestId);
    req.flash('success', 'Blood request deleted successfully');
    res.redirect('/my-requests');
  } catch (error) {
    console.error('Error deleting blood request:', error);
    req.flash('error', 'An error occurred while deleting the request');
    res.redirect('/my-requests');
  }
};

