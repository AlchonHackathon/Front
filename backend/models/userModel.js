
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userId: {type: String, required: [true, 'Please enter ID']},
  name: {type: String, required: [true, 'Please enter name']},
  email: {type: String, required: [true, 'Please enter email']},
  password: {type: String, required: [true, 'Please enter password']},
  type: {type: String, required: [true, 'Please choose type']},
  profile_pic: {type: mongoose.Schema.Types.ObjectId, ref: 'File'},
  securityQuestion: {type: String, required: true},
  securityAnswer: {type: String, required: true},
  labId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lab', default: null},
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);