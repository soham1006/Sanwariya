const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    category: {
      type: String,
      enum: ["Hall", "Restaurant", "Rooms"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
