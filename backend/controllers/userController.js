
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc Sign up
// @route POST /api/users/signup
// @access Public
const signUp = asyncHandler(async (req, res) => {
  console.log("Masuk");
  const { type, name, email } = req.body;

  if (!type || !name || !email) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  try {
    const API_URL = 'https://service-testnet.maschain.com/api/wallet/create-user';
    const CLIENT_ID = 'dcc67b1d4f9c7db2483e7823e14a4bfb28ee87e96abb857e57febbcba16836db';
    const CLIENT_SECRET = 'sk_07bdb646220d6ca9081ab8bead4ea41e2c1f0fb0a7ea2d992faa9f119e5a25ba';

    const response = await axios.post(
      `${API_URL}`,
      { type, name, email },
      {
        headers: {
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET,
        }
      }
    );

    const walletAddress = response.data.wallet.wallet_address;

    const user = await User.create({
      type,
      name,
      email,
      walletAddress,
    });

    if (user) {
      res.status(201).json({ message: 'User created successfully', user });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Error creating user: ' + error.message);
  }
});

// @desc Log in
// @route GET /api/users/login
// @access Public
const logIn = asyncHandler( async (req, res) => {
  const {userId, password} = req.body;
  
  const user = await User.findOne({userId});
  if (user) {
    res.status(200).json({
      message: 'User logged in successfully',
      userId: user.userId,
      type: user.type,
      token: generateToken(user.userId),
    }) 
  }
  else {
    res.status(400);
    throw new Error('Invalid credentials');
  }

}); 

// @desc Get user info
// @route GET /api/users/me
// @access Private
const getMyInfo = asyncHandler (async (req, res) => {
  res.status(200).json({message: 'User info retrieved', user: req.user});
});

// @desc Get user info
// @route GET /api/users/all
// @access Private
const getAllUsers = asyncHandler (async (req, res) => {

  const users = await User.find().select('-password -securityAnswer');
  if (!users) {
    res.status(404);
    throw new Error('Users not found');
  }

  res.status(200).json({message: 'Users info retrieved', users});
});

// @desc Update user info
// @route PUT /api/users/me
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  console.log(req.body)
  if (req.user.userId !== req.body.userId) {
    res.status(401);
    throw new Error('Not authorized to update user');
  }

  const options = {new: true};
  const update = {
    userId: req.body.userId,
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findOne({userId: req.user.userId});

  if (req.body.newPassword !== '') {
    const match = await comparePasswords(req.body.oldPassword, user.password);
    if (!match) {
      res.status(400);
      throw new Error('Old passwords do not match');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    update['password'] = hashedPassword;
  }

  if (req.body.profile_pic) {
    update['profile_pic'] = req.body.profile_pic;
  }

  const updatedUser = await User.findOneAndUpdate({
    userId: req.user.userId
  }, update, options);

  res.status(200).json({message: 'User updated successfully', updatedUser});
});

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d',});
};


module.exports = {
  signUp,
  logIn,
  getMyInfo,
  getAllUsers,
  updateUser,
};