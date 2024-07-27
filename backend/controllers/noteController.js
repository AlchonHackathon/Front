
const asyncHandler = require('express-async-handler');
const Note = require('../models/noteModel');

// @desc Get note
// @route GET /api/notes
// @access Private
const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({userId: req.user.userId});
  res.status(200).json({message: 'Note retrieved successfully', note});
});

// @desc Update note
// @route PUT /api/notes    <--- do we add /:userId for standards?
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const newNote = req.body.note;
  const options = {new: true, upsert: true, setDefaultsOnInsert: true};

  const note = await Note.findOneAndUpdate({userId: req.user.userId}, {text: newNote}, options);
  if (!note) {
    return res.status(201).json({ message: "Note created successfully", data: note });
  }
  res.status(200).json({ message: "Note updated successfully", data: note, newNote: newNote});
});

module.exports = {
  getNote,
  updateNote,
};