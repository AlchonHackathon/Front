const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getLabs,
  getLab,
  createLab,
  updateLab
} = require ('../controllers/labController')

router.get('/', protect, getLabs);
router.get('/me', protect, getLab);
router.post('/', protect, createLab);
router.put('/', protect, updateLab);

module.exports = router;