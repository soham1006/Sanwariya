const express = require("express");
const router = express.Router();
const Otp = require("../models/Otp");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------- SEND EMAIL OTP ----------------
router.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is required" });

  const otp = generateOTP();
  console.log("FROM ENV:", process.env.RESEND_FROM_EMAIL);
  console.log("Sending OTP to:", email);

  try {
    // Remove previous OTP for same email
    await Otp.findOneAndDelete({ email });

    // Save new OTP
    await Otp.create({ email, otp });

    // Send email using Resend
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <h2>Your OTP is: <span style="color:#F4B400">${otp}</span></h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("Email response:", data);


    res.json({
      success: true,
      message: "OTP sent successfully!",
    });

  } catch (error) {
    console.error("OTP Send Error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// ---------------- VERIFY OTP ----------------
router.post("/verify-email-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email & OTP are required" });

  const record = await Otp.findOne({ email });

  if (!record) return res.status(400).json({ success: false, message: "OTP expired" });

  if (record.otp !== otp)
    return res.status(400).json({ success: false, message: "Invalid OTP" });

  await Otp.deleteOne({ email });

  return res.json({ success: true, message: "OTP verified successfully!" });
});

module.exports = router;
