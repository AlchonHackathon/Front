
const express = require('express');
const router = express.Router();
const {getNote, updateNote} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNote);
router.put('/', protect, updateNote);
module.exports = router;