// router/verificationRoutes.js
const express = require('express');
const router = express.Router();
const { sendCode, verifyCode } = require('../controllers/verificationController');

router.post('/send-code', sendCode);
router.post('/verify-code', verifyCode);

module.exports = router;
