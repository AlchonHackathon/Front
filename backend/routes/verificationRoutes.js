const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyCode } = require('../controllers/verificationController');

// Route for sending verification code
router.post('/send-code', sendVerificationCode);

// Route for verifying the code
router.post('/verify-code', verifyCode);

module.exports = router;
