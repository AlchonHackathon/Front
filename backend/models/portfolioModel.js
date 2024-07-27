
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true },
  currentSchoolYear: { type: String, required: true },
  languagesSpoken: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  kakaoId: { type: String },
  major: { type: String, required: true },
  specializeInterest: { type: String, required: true },
  averageGpa: { type: Number, required: true },
  skillsExpertise: { type: String, required: true },
  achievements: { type: String },
  experiences: { type: String },
  personalStatement: { type: String, required: true },
}, {
  timestamps: true,
})

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
module.exports = Portfolio;