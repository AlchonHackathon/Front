
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {type: String, required: [true, 'Please enter filename']},
  contentType: {type: String, required: true},
  size: {type: Number, required: true},
  data: {type: Buffer, required: true}, 
}, {
  timestamps: true,
});

module.exports = mongoose.model('File', fileSchema);