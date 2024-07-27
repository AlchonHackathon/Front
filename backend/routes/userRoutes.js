const express = require('express');
const router = express.Router();
const { 
  signUp, 
  logIn, 
  getMyInfo, 
  getAllUsers,
  updateUser
  } = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/me', protect, getMyInfo);
router.get('/all', protect, getAllUsers);
router.put('/me', protect, updateUser);

module.exports = router;