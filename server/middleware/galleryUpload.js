const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gallery",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const galleryUpload = multer({ storage });

module.exports = galleryUpload;
