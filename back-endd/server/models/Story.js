const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    index: true,
  },
  createdAt: { type: Date, default: Date.now },
});

storySchema.index({ title: "text", content: "text", author: "text" });
storySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Story", storySchema);
