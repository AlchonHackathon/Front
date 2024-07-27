
const asyncHandler = require('express-async-handler');
const Portfolio = require('../models/portfolioModel');

// @desc Get portfolio
// @route GET /api/portfolios/:studentId
// @access Private
const getPortfolio = asyncHandler(async (req, res) => {

  const portfolio = await Portfolio.findOne({studentId: req.params.studentId});
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  //currently check if accessor is the student with the portfolio or a professor
  //should be professor in charge... maybe add to userModel later
  if (portfolio.studentId !== req.user.userId 
    && req.user.type !== 'professor'){ 
      res.status(401);
      throw new Error('Not authorized for access to portfolio');
  }
  
  res.status(200).json({message: 'Portfolio retrieved', portfolio});
});

// @desc Update portfolio
// @route PUT /api/portfolios
// @access Private
const updatePortfolio = asyncHandler(async (req, res) => {
  const update = req.body;
  const options = {new: true, upsert: true, setDefaultOnInsert: true};

  const portfolio = await Portfolio.findOneAndUpdate({
    studentId: req.user.userId
  }, update, options);

  res.status(200).json({message: 'Portfolio updated successfully', portfolio});
});

module.exports = {
  getPortfolio,
  updatePortfolio,
};


