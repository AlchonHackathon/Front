// models/userModel.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
