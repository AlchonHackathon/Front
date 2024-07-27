
const express = require('express');
const router = express.Router();
const {getMail, sendMail, readMail} = require('../controllers/mailController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:mailType', protect, getMail);
router.post('/', protect, sendMail);
router.put('/:mailId', protect, readMail);

module.exports = router;