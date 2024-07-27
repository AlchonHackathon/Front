
const asyncHandler = require('express-async-handler');
const Mail = require('../models/mailModel');

// @desc Get mail
// @route GET /api/mail/:mailType
// @access Private
const getMail = asyncHandler(async (req, res) => {

  mailType = req.params.mailType;
  let mail;
  if (mailType === 'incoming'){
    mail = await Mail.aggregate([
      { $match: { recId: req.user.userId } },
      { $sort: { isRead: 1, createdAt: -1 } }
    ]);
  }
  else if (mailType === 'sent'){
    mail = await Mail.aggregate([
      { $match: { senderId: req.user.userId } },
      { $sort: { isRead: 1, createdAt: -1 } }
    ]);
  }
  else {
    res.status(400);
    throw new Error('Mail type must be incoming or sent');
  }
  
  if (mail.length === 0) {
    res.status(400);
    throw new Error('No incoming mail');
  }
  res.status(200).json({message: 'Mail retrieved', mail});
});

// @desc Send mail
// @route POST /api/mail
// @access Private
const sendMail = asyncHandler(async (req, res) => {
  if (!req.body.recId || !req.body.title || !req.body.content) {
    res.status(400);
    throw new Error('Please fill in the fields');
  }

  const mail = await Mail.create({
    senderId: req.user.userId,
    recId: req.body.recId,
    title: req.body.title,
    content: req.body.content,
  });

  res.status(201).json({ message: 'Mail sent', mail});
});

// @desc Read mail
// @route PUT /api/mail/mailId
// @access Private
const readMail = asyncHandler(async (req, res) => {
  
  const mail = await Mail.findById(req.params.mailId);
  if (!mail) {
    res.status(404);
    throw new Error('Mail not found');
  }

  if (req.user.userId !== mail.recId) {
    res.status(400);
    throw new Error('Not authorized to update read status of mail');
  }

  const options = {new: true};

  const updatedMail = await Mail.findByIdAndUpdate(req.params.mailId, {isRead: true}, options);
  if (!updatedMail) {
    res.status(404);
    throw new Error('Mail not found');
  }
  res.status(200).json({ message: "Mail updated successfully", data: updatedMail});
})

module.exports = {
  getMail,
  sendMail,
  readMail,
};

