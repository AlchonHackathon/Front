
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {type: String, required: true},
  profId: {type: String, required: true},
  labId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lab'},
  status: {type: String, required: true, default: 'Ongoing'},
}, {
  timestamps: true,
});

module.exports = mongoose.model('Application', applicationSchema);