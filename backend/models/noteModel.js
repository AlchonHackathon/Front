
const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  userId: {type: String, required: true},
  text: {type: String, required: true, default: ''}
}, {
  timestamps: true,
});

module.exports = mongoose.model('Note', noteSchema);