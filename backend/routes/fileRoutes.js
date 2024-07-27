const express = require('express');
const upload = require('../middleware/multer');
const router = express.Router();

const { 
  uploadFile,
  uploadFiles, 
  getFile,
  getPicture,
  downloadFile, 
  deleteFile } = require('../controllers/fileController');

router.post('/single', upload.single('file'), uploadFile);
//router.post('/picture', upload.single('picture'), uploadFile);
//router.post('/multiple', upload.array('files', 10), uploadFiles);

router.get('/:id', getFile);
router.get('/pictures/:id', getPicture);
router.get('/download/:id', downloadFile);

router.delete('/delete/:id', deleteFile);

module.exports = router;
