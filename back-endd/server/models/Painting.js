const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "Untitled painting",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

paintingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Painting", paintingSchema);
