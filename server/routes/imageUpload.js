const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { v2: cloudinary } = require('cloudinary');

router.post('/', upload.single('dishImage'), async (req, res) => {
  try {
    console.log("REQ FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
        debug: 'req.file missing'
      });
    }

    const oldPublicId = req.body.oldPublicId;

    // Delete previous image if exists
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log("🗑️ Deleted old image:", oldPublicId);
      } catch (err) {
        console.warn("⚠️ Failed to delete old image:", err.message);
      }
    }

    // Cloudinary returns:
    // req.file.path      → full URL
    // req.file.filename  → public ID (CloudinaryStorage)
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    res.status(200).json({ imageUrl, publicId });

  } catch (err) {
    console.error("❌ Upload Failed:", err.message);
    res.status(500).json({ message: "Image upload failed" });
  }
});

module.exports = router;
