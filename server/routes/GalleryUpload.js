const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Gallery = require("../models/Gallery");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

/* GET ALL GALLERY IMAGES (PUBLIC) */
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error("FETCH GALLERY ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch gallery images" });
  }
});


/* UPLOAD IMAGE */
router.post("/upload", upload.single("galleryImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "gallery",
    });

    res.json({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Upload failed" });
  }
});

/* SAVE IMAGE (NO AUTH — LIKE AddDish) */
router.post("/", async (req, res) => {
  try {
    const { category, imageUrl } = req.body;

    if (!category || !imageUrl) {
      return res.status(400).json({ msg: "Category & image required" });
    }

    const img = await Gallery.create({
      category,
      url: imageUrl,
    });

    res.status(201).json(img);
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ msg: "Save failed" });
  }
});

module.exports = router;
