// controller/verificationController.js
const nodemailer = require('nodemailer');

let userVerificationCodes = {}; // In-memory storage for simplicity. Use a database in production.

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const sendCode = async (req, res) => {
    const { email } = req.body;
    const code = generateRandomCode();

    // Store the code with an expiration time
    userVerificationCodes[email] = { code, expires: Date.now() + 15 * 60 * 1000 }; // 15 minutes

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${code}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).send({ message: 'Verification code sent to your email.' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Failed to send email.');
    }
};

const verifyCode = (req, res) => {
    const { email, code } = req.body;

    const userCode = userVerificationCodes[email];
    if (userCode && userCode.code === code && userCode.expires > Date.now()) {
        delete userVerificationCodes[email]; // Code is used, remove it
        return res.status(200).send({ message: 'Verification successful.' });
    } else {
        return res.status(400).send({ message: 'Invalid or expired code.' });
    }
};

module.exports = {
    sendCode,
    verifyCode
};
