const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Otp = require('../models/Otp');
dotenv.config();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via SendGrid
router.post('/send-email-otp', async (req, res) => {
 
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = generateOTP();
   console.log("Sending OTP to", email);
  try {
    await Otp.findOneAndDelete({ email }); 

    await Otp.create({ email, otp });

    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });

    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL,
      to: email,
      subject: 'Your OTP for Booking',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.error('OTP error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-email-otp', async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });

  if (record && record.otp === otp) {
    await Otp.deleteOne({ email }); 
    res.json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid or expired OTP' });
  }
});

module.exports = router;
