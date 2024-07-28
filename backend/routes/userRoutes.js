const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  signUp,
  logIn, 
  getMyInfo, 
  getAllUsers,
  updateUser
  } = require('../controllers/userController');

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/me', getMyInfo);
router.get('/all', getAllUsers);
router.put('/me', updateUser);

module.exports = router;