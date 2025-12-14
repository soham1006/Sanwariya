const express = require("express");
const Gallery = require("../models/Gallery");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/auth");
const galleryUpload = require("../middleware/galleryUpload");

const router = express.Router();

/* ================= PUBLIC ================= */

// Get all gallery images
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch gallery" });
  }
});

/* ================= ADMIN ================= */

// Upload image
router.post(
  "/upload",
  auth,
  adminOnly,
  galleryUpload.single("image"),
  async (req, res) => {
    try {
      if (!req.file || !req.body.category) {
        return res.status(400).json({ msg: "Image and category required" });
      }

      const img = await Gallery.create({
        url: req.file.path,
        category: req.body.category.toLowerCase(),
      });

      res.json(img);
    } catch (err) {
      res.status(500).json({ msg: "Upload failed" });
    }
  }
);

// Delete image
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

module.exports = router;
