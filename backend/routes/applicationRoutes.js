
const express = require('express');
const router = express.Router();
const { 
  getApplications,
  getApplicationsWithDetails,
  setApplication, 
  updateApplication, 
  getApplicationCount} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getApplications)
router.get('/plus', protect, getApplicationsWithDetails)
router.get('/count/:status', protect, getApplicationCount);
router.post('/', protect, setApplication)
router.put('/:studentId', protect, updateApplication);

module.exports = router;