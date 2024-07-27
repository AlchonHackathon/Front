
const mongoose = require('mongoose');

const mailSchema = mongoose.Schema({
  senderId: {type: String, required:[true, 'Please enter sender ID']},
  recId: {type: String, required:[true, 'Please enter recipient ID']},
  title: {type: String, required:[true, 'Please enter title']},
  content: {type: String, required:[true, 'Please enter content']},
  isRead: {type: Boolean, required: true, default: false}
}, {
  timestamps: true,
});

module.exports = mongoose.model('Mail', mailSchema);