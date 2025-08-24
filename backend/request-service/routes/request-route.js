const express = require('express');
const router = express.Router();
const {
  createRequest,
  
  getNearbyRequestsForDonor,
  claimRequest,
  getAllRequests,
  getreceiverRequests
} = require('../controllers/request-controller');
const checkAuthUser = require('../../shared/middlewares/authUser');

// 1. Receiver sends a blood request
router.post('/create',checkAuthUser, createRequest);

// 2. Receiver sees all their previous requests
router.get('/receiver/:receiverId', getreceiverRequests);

// 3. Donor sees requests near them (based on location & blood type)
router.post('/donar/nearby', getNearbyRequestsForDonor);

// 4. Donor claims a request
router.get('/claim/:requestId', claimRequest);

// 5. Admin or anyone can view all requests
router.get('/all', getAllRequests);

module.exports = router;
