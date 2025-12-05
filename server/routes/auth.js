const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const { Resend } = require("resend");

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* -----------------------------------
   SEND OTP (EMAIL VERIFICATION)
-------------------------------------*/
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.json({ success: false, message: "Email required" });

  const otp = generateOTP();

  try {
    // delete old otp
    await Otp.findOneAndDelete({ email });

    // save new otp
    await Otp.create({ email, otp });

    console.log("Sending Register OTP via RESEND:", email);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: "Your OTP Verification Code",
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2><p>Valid for 5 minutes</p>`
    });

    return res.json({ success: true, message: "OTP sent" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "OTP send failed" });
  }
});


/* -----------------------------------
         VERIFY EMAIL OTP
-------------------------------------*/
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });

  if (!record) return res.json({ success: false, message: "OTP expired" });

  if (record.otp !== otp)
    return res.json({ success: false, message: "Invalid OTP" });

  // delete otp after verification
  await Otp.deleteOne({ email });

  return res.json({ success: true, message: "OTP verified" });
});


/* -----------------------------------
            REGISTER USER
-------------------------------------*/
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exist = await User.findOne({ email });
    if (exist) return res.json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed
    });

    return res.json({ success: true, message: "Account created" });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});


/* -----------------------------------
                LOGIN
-------------------------------------*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.json({ success: false, message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.json({ success: false, message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    success: true,
    token,
    message: "Login successful"
  });
});


module.exports = router;
