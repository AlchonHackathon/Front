const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { User } = require('../models/userModel'); // Import the User model

// Dummy database to store verification codes temporarily
const verificationCodes = {};

// Function to generate a random verification code
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex');
};

// Controller for sending verification code
const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Generate a random verification code
  const code = generateVerificationCode();
  verificationCodes[email] = code;

  // Set up the email transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook'
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send verification code' });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Verification code sent' });
  });
};

// Controller for verifying the code
const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and verification code are required' });
  }

  const storedCode = verificationCodes[email];

  if (!storedCode) {
    return res.status(400).json({ message: 'No verification code found for this email' });
  }

  if (storedCode !== code) {
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  // Verification successful, clear the stored code
  delete verificationCodes[email];

  res.status(200).json({ message: 'Verification successful' });
};

module.exports = {
  sendVerificationCode,
  verifyCode,
};
