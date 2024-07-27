
const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  // after login part finished connect
  // student: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  // prof: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Professor'},
  student: {type: String, required: true},
  prof: {type: String, required: true},
  title: {type: String, required: [true, 'Please add a title']},
  text: {type: String, required: [true, 'Please enter text']},
  file: {type: mongoose.Schema.Types.ObjectId, ref: 'File'},
  isRead: {type: Boolean, required: true, default: false}
}, {
  timestamps: true,
});

module.exports = mongoose.model('Report', reportSchema);