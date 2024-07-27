
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userId: {type: String, required: [true, 'Please enter ID']},
  email: {type: String, required: [true, 'Please enter email']},
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);