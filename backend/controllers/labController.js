
const asyncHandler = require('express-async-handler');
const Lab = require('../models/labModel');
const User = require('../models/userModel');

// @desc Get labs
// @route GET /api/labs
// @access Private
const getLabs = asyncHandler(async (req, res) => {
  
  const labs = await Lab.aggregate([
    { $addFields: {
        openSlots: { $subtract: ["$maxSlots", "$slots"]}
      }
    },{ 
      $sort: { openSlots: -1 }
    }, {
      $lookup: {
        from: 'users',
        let: { labId: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$labId', '$$labId'] }, 
                      { $eq: ['$type', 'professor'] }] } } },
          { $project: { name: 1, email: 1 } }
        ],
        as: 'profInfo'
      }
    },
    {
      $unwind: {
        path: '$profInfo',
        preserveNullAndEmptyArrays: true  // In case some labs do not have a corresponding professor
      }
    }, {
      $project: {
        _id: 1, name: 1, profId: 1, major: 1, submajor: 1,
        description: 1, labPosition: 1, masters: 1,
        language: 1, slots: 1, maxSlots: 1, openSlots: 1,
        expectations: 1, salary: 1, website: 1,
        studentIds: 1, createdAt: 1, updatedAt: 1,
        'profInfo.name': 1, 'profInfo.email': 1
      }
    }
  ]);
  
  if (labs.length === 0) {
    res.status(404);
    throw new Error('Labs not found');
  }
  res.status(200)
     .json({message: 'Labs retrieved', labs});
  
});

// @desc Get labs
// @route GET /api/labs/me
// @access Private
const getLab = asyncHandler(async (req, res) => {

  console.log(req.user);
  const labs = await Lab.aggregate([
    {
      $match: {_id: req.user.labId}
    },{ 
      $addFields: {
        openSlots: { $subtract: ["$maxSlots", "$slots"]}
      }
    },{ 
      $sort: { openSlots: -1 }
    },{
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'labId',
        as: 'profInfo'
      }
    }, {
      $unwind: '$profInfo'
    }, {
      $project: {
        _id: 1, name: 1, profId: 1, major: 1, submajor: 1,
        description: 1, labPosition: 1, masters: 1,
        language: 1, slots: 1, maxSlots: 1, openSlots: 1,
        expectations: 1, salary: 1, website: 1,
        studentIds: 1, createdAt: 1, updatedAt: 1,
        'profInfo.name': 1, 'profInfo.email': 1
      }
    }
  ]);

  console.log(labs);
  
  if (labs.length === 0) {
    res.status(404);
    throw new Error('Lab not found');
  }
  res.status(200)
     .json({message: 'Lab retrieved', lab: labs[0]});
  
});

// @desc Create lab
// @route POST /api/labs
// @access Private
const createLab = asyncHandler(async (req, res) => {

  if (req.user.type !== 'professor') {
    res.status(401);
    throw new Error ('Not authorized to create lab');
  }

  const {
    name,
    labPosition,
    major,
    submajor,
    description,
    expectations,
    language,
    salary,
    maxSlots,
    masters,
    website
  } = req.body;

  if (!name, !major || !submajor || !labPosition || !description ||
    !expectations || !language || !salary || !maxSlots || !website) 
  { 
    res.status(400);
    throw new Error ('Please fill in the fields');
  }

  const lab = await Lab.create({
    name,
    labPosition,
    major,
    submajor,
    description,
    expectations,
    language,
    salary,
    maxSlots,
    masters,
    website,
  });

  if (!lab) {
    res.status(500);
    throw new Error ('Lab creation failed');
  }

  const updatedUser = await User.findOneAndUpdate(
    { userId: req.user.userId },
    { labId: lab._id },
    { new: true}
  )

  res.status(201).json({message: 'Lab created', lab});
});

// @desc Update lab
// @route PUT /api/labs
// @access Private
const updateLab = asyncHandler(async (req, res) => {

  if (req.user.type !== 'professor') {
    res.status(401);
    throw new Error ('Not authorized to update lab');
  }

  const lab = await Lab.findById(req.user.labId);
  if (!lab) {
    res.status(404);
    throw new Error ('Lab not found');
  }

  const update = req.body;
  const options = {new: true};

  const updatedLab = await Lab.findByIdAndUpdate(req.user.labId, update, options);

  res.status(200).json({message: 'Lab updated successfully', updatedLab});
});

module.exports = {
  getLabs,
  getLab,
  createLab,
  updateLab,
};


