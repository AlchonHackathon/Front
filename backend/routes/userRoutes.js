const express = require('express');
const router = express.Router();
const { 
  signUp, 
  logIn, 
  getMyInfo, 
  getAllUsers,
  updateUser,
  getSecurityQuestion,
  verifySecurityAnswer,
  resetPassword
  } = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/me', protect, getMyInfo);
router.get('/all', protect, getAllUsers);
router.put('/me', protect, updateUser);
router.get('/security-question/:userId', getSecurityQuestion);
router.post('/verify-security-answer', verifySecurityAnswer);
router.post('/reset-password', resetPassword);

module.exports = router;