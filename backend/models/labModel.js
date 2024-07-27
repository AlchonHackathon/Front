
const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: {type: String, required: true},
  major: {type: String, required: true},
  submajor: {type: String, required: true},
  description: {type: String, required: true},
  labPosition: {type: String, required: true},
  masters: {type: Boolean, required: true},
  language: {type: String, required: true},
  slots: {type: Number, required: true, default: 0},
  maxSlots: {type: Number, required: true},
  expectations: {type: String, required: true},
  salary: {type: String, required: true},
  website: {type: String, required: true},
  studentIds: {type: [String], required: true, default: []},
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lab', labSchema);