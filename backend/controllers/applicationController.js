
const asyncHandler = require('express-async-handler');
const Application = require('../models/applicationModel');
const User = require('../models/userModel');
const Lab = require('../models/labModel');

// @desc Get application
// @route GET /api/applications
// @access Private
const getApplications = asyncHandler(async (req, res) => {
  let applications;
  if (req.user.type === 'student'){
    applications = await Application.find({studentId: req.user.userId});
  } else {
    applications = await Application.find({profId: req.user.userId});
  }

  if (applications.length === 0) {
    res.status(404);
    throw new Error('No applications found');
  }
  res.status(200).json({message: 'Applications retrieved', applications: applications.reverse()});
});

// @desc Get applications with student details
// @route GET /api/applications/plus
// @access Private
const getApplicationsWithDetails = asyncHandler(async (req, res) => {
  if (req.user.type !== 'professor') {
    res.status(400);
    throw new Error('Not authorized to get applications with student details');
  }

  const applications = await Application.aggregate([
    { $match: {profId: req.user.userId}},{
      $lookup: {
        from: 'portfolios',
        localField: 'studentId',
        foreignField: 'studentId',
        as: 'studentInfo'}
    }, {
      $sort: { createdAt: -1}
    }, {
      $unwind: '$studentInfo'
    }, {
      $project: {
        _id: 1,
        studentId: 1,
        profId: 1,
        labId: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        'studentInfo.name': 1,
        'studentInfo.major': 1,
        'studentInfo.skillsExpertise': 1
      }
    }
  ]);

  if (applications.length === 0) {
    res.status(404);
    throw new Error('No applications found');
  }

  res.status(200).json({message: 'Applications retrieved', applications});
});

// @desc Get application count
// @route GET /api/applications/count/:status
// @access Private
const getApplicationCount = asyncHandler(async (req, res) => {

  const appStatus = req.params.status;
  if (appStatus !== 'Ongoing' && appStatus !== 'Accepted' && appStatus !== 'Rejected') {
    res.status(400);
    throw new Error('Unknown status');
  }

  let appCount;
  if (req.user.type === 'professor') {
    appCount = await Application.countDocuments({ profId: req.user.userId, status: appStatus });
  } else {
    appCount = await Application.countDocuments({ studentId: req.user.userId, status: appStatus });
  }
  

  res.status(200).json({message: `${appStatus} application count retrieved`, appCount});
});

// @desc Set application
// @route POST /api/applications
// @access Private
const setApplication = asyncHandler(async (req, res) => {
  console.log(req.body);
  if (req.user.type === 'professor') {
    res.status(400);
    throw new Error ('Professors cannot submit application');
  }
  
  if (!req.body.profId) {
    res.status(400);
    throw new Error ('Please provide profId');
  }

  const prof = await User.findOne({userId: req.body.profId});
  if (!prof) {
    res.status(400);
    throw new Error ('Professor does not exist');
  }

  const lab = await Lab.findById(prof.labId);
  if (!lab) {
    res.status(400);
    throw new Error ('Lab does not exist');
  }

  const application = await Application.create({
    studentId: req.user.userId,
    profId: prof.userId,
    labId: lab._id,
  });

  res.status(201).json({messsage: 'Application Submitted', application});
})

// @desc Update application
// @route PUT /api/applications/:studentId
// @access Private
const updateApplication = asyncHandler(async (req, res) => {
  if (req.user.type !== 'professor') {
    res.status(400);
    throw new Error('Not authorized to update application');
  }

  const application = await Application.findOne({
    studentId: req.params.studentId, 
    profId: req.user.userId,
    labId: req.user.labId,
  });
  
  if (!application) {
    res.status(400);
    throw new Error('Application not found');
  }

  const student = await User.findOne({userId: req.params.studentId});
  if (!student) {
    res.status(400);
    throw new Error('Student not found');
  }

  const update = req.body;
  const options = {new: true};

  const updatedApplication = await Application.findOneAndUpdate({
    studentId: req.params.studentId, 
    profId: req.user.userId,
    labId: req.user.labId,
  }, update, options);

  let updatedStudent;
  let updatedLab;

  if (update.status === 'Accepted') {
    updatedStudent = await User.findOneAndUpdate({userId: req.params.studentId}, {
      labId: req.user.labId,
    }, options);
  
    updatedLab = await Lab.findByIdAndUpdate(req.user.labId, {
      $inc: { slots: 1 },
      $push: { studentIds: req.params.studentId}
    }, options);
  }
  else if (student.labId && student.labId === application.labId){
    updatedStudent = await User.findOneAndUpdate({userId: updatedApplication.studentId}, {
      labId: null,
    }, options);
  
    updatedLab = await Lab.findByIdAndUpdate(updatedApplication.labId, {
      $inc: { slots: -1 },
      $pull: { studentIds: req.params.studentId}
    }, options);
  }
  res.status(200).json({message: 'Application updated successfully', updatedApplication, updatedStudent, updatedLab});
});


module.exports = {
  getApplications,
  getApplicationsWithDetails,
  getApplicationCount,
  setApplication,
  updateApplication,
};