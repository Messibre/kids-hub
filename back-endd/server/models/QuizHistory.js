const mongoose = require("mongoose");

const quizHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    numberQuestionsDid: {
      type: Number,
      required: true,
      min: 0,
    },
    numberQuestionsGot: {
      type: Number,
      required: true,
      min: 0,
    },
    scorePercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true },
);

quizHistorySchema.index({ user: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model("QuizHistory", quizHistorySchema);
