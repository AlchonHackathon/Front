const express = require('express');
const router = express.Router();
const { 
  getReports, 
  setReport, 
  getReportsWithStudentName,
  readReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReports);
router.get('/plus', protect, getReportsWithStudentName);
router.post('/', protect, setReport);
router.put('/:reportId', protect, readReport);

//At the moment, can only send and receive post, no update / delete fx

// router.put('/:id', (req, res) => {
//   res.status(200).json({ message: `Update report ${req.params.id}`});
// });

// router.delete('/:id', (req, res) => {
//   res.status(200).json({ message: `Delete report ${req.params.id}`});
// });

module.exports = router;