
const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');

// @desc Upload file
// @route POST /api/uploads/single
// @access Private
const uploadFile = asyncHandler(async (req, res) => {
  
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const {originalname, buffer, mimetype, size}= req.file;
  const file = new File({
    filename: `${Date.now()}-${originalname}`,
    contentType: mimetype,
    size: size,
    data: buffer,
  });

  await file.save();
  res.status(201).json({ fileId: file._id});
});

// @desc Upload files
// @route POST /api/uploads/multiple
// @access Private
const uploadFiles = asyncHandler(async (req, res) => {

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const files = req.files.map(file => ({
    filename: `${Date.now()}-${file.originalname}`,
    contentType: file.mimetype,
    size: file.size,
    data: file.buffer,
  }));

  await File.insertMany(files);
  res.status(201).json({ message: 'Files uploaded successfully'});
});

// @desc Get file name
// @route GET /api/uploads/:id
// @access Private
const getFile = asyncHandler( async (req, res) => {
  
  const fileId = req.params.id;
  const file = await File.findById(fileId).select('-data');

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }
  res.status(200).json({ message: 'File retrieved', file });
});

// @desc Get picture
// @route GET /api/uploads/picture/:id
// @access Private
const getPicture = asyncHandler( async (req, res) => {
  
  const fileId = req.params.id;
  const picture = await File.findById(fileId);

  if (!picture) {
    res.status(404);
    throw new Error('Picture not found');
  }
  const convertedPicture = convertPictureToBase64(picture);
  res.status(200).json({ message: 'Picture retrieved', picture: convertedPicture});
});


// @desc Download file
// @route GET /api/uploads/download/:id
// @access Private
const downloadFile = asyncHandler( async (req, res) => {

  const fileId = req.params.id;
  const file = await File.findById(fileId);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  res.set('Content-Type', file.contentType);
  res.set('Content-Disposition', `attachment; filename=${file.filename}`);
  res.status(200).send(file.data);
  // res.status(200).json({message: 'Successful download'})
});

// @desc Delete file
// @route DELETE /api/uploads/delete/:id
// @access Private
const deleteFile = asyncHandler( async (req, res) => {

  const fileId = req.params.id;
  const file = await File.findByIdAndDelete(fileId);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  res.status(201).json({ message: 'File deleted successfully'});
});

const convertPictureToBase64 = (picture) => {
  if (picture && picture.data) {
    return `data:${picture.contentType};base64,${picture.data.toString('base64')}`;
  }
  return null;
};

module.exports = {
  uploadFile,
  uploadFiles,
  getFile,
  getPicture,
  downloadFile,
  deleteFile,
};