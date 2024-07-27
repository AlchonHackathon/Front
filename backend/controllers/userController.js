
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc Sign up
// @route GET /api/users/signup
// @access Public
const signUp = asyncHandler(async (req, res) => {

  const { userId, email } = req.body;

  if (!userId || !email) {
    res.status(400);
    throw new Error ('Please fill in all fields');
  }

  const existingUser = await User.findOne({ userId });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);

  const user = await User.create({
    userId,
    name: userId,
    email,
  });

  if (user) {
    res.status(201).json({message: 'User created successfully', user});
  }
  else {
    res.status(400);
    throw new Error ('Invalid user data');
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