
const asyncHandler = require('express-async-handler');
const Report = require('../models/reportModel');

// @desc Get reports
// @route GET /api/reports
// @access Private
const getReports = asyncHandler(async (req, res) => {
  
  let reports;
  if (req.user.type === 'student') {
    reports = await Report.aggregate([
      { $match: { student: req.user.userId }},
      { $sort: { createdAt: -1}}
    ]);
  }
  else {
    reports = await Report.aggregate([
      { $match: { prof: req.user.userId }},
      { $sort: { isRead: 1, createdAt: -1}}
    ]);
  }

  if (reports.length === 0) {
    res.status(404);
    throw new Error('Report not found');
  }
  res.status(200).json({message: 'Reports retrieved', reports});
});

// @desc Get reports
// @route GET /api/reports/plus
// @access Private
const getReportsWithStudentName = asyncHandler(async (req, res) => {
  
  if (req.user.type !== 'professor') {
    return res.status(400).json({
      message: 'Not authorized to get reports of multiple students'});
  }

  const reports = await Report.aggregate([
    { $match: {prof: req.user.userId}},{
      $lookup: {
        from: 'users',
        localField: 'student',
        foreignField: 'userId',
        as: 'studentInfo'}
    }, { 
      $sort: { isRead: 1, createdAt: -1}
    }, {
      $unwind: '$studentInfo'
    }, {
      $project: {
        _id: 1,
        student: 1,
        prof: 1,
        title: 1,
        text: 1,
        file: 1,
        isRead: 1,
        createdAt: 1,
        updatedAt: 1,
        'studentInfo.name': 1
      }
    }
  ]);

  if (reports.length === 0) {
    res.status(404);
    throw new Error('Report not found');
  }
  res.status(200).json({message: 'Reports retrieved', reports});
});

// @desc Set report
// @route POST /api/reports
// @access Private
const setReport = asyncHandler(async (req, res) => {
  if (!req.body.text || !req.body.title) {
    res.status(400);
    throw new Error ('Please fill in the fields');
  }
  //add studId n profId
  const report = await Report.create({
    student: req.user.userId,
    prof: req.body.prof,
    title: req.body.title,
    text: req.body.text,
    file: req.body.file
  })

  res.status(201).json({message: 'Report Submitted', report});
});

// @desc Read reports
// @route PUT /api/reports/:reportId
// @access Private
const readReport = asyncHandler(async (req, res) => {
  
  const report = await Report.findById(req.params.reportId);
  if (!report) {
    res.status(404);
    throw new Error('Mail not found');
  }

  if (req.user.userId !== report.prof) {
    res.status(400);
    throw new Error('Not authorized to update read status of mail');
  }

  const options = {new: true};

  const updatedReport = await Report.findByIdAndUpdate(req.params.reportId, {isRead: true}, options);
  if (!updatedReport) {
    res.status(404);
    throw new Error('Mail not found');
  }
  res.status(200).json({ message: "Report updated successfully", data: updatedReport});
})

module.exports = {
  getReports,
  getReportsWithStudentName,
  setReport,
  readReport,
};
