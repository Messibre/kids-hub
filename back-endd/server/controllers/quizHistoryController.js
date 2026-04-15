const mongoose = require("mongoose");
const QuizHistory = require("../models/QuizHistory");

const toNumber = (value) => Number.parseInt(value, 10);

const buildQuizHistoryPayload = (body) => {
  const category =
    typeof body.category === "string" ? body.category.trim() : "";
  const numberQuestionsDid = toNumber(body.numberQuestionsDid);
  const numberQuestionsGot = toNumber(body.numberQuestionsGot);

  if (!category) {
    return { error: "Category is required" };
  }

  if (Number.isNaN(numberQuestionsDid) || numberQuestionsDid < 0) {
    return { error: "numberQuestionsDid must be a non-negative number" };
  }

  if (Number.isNaN(numberQuestionsGot) || numberQuestionsGot < 0) {
    return { error: "numberQuestionsGot must be a non-negative number" };
  }

  if (numberQuestionsGot > numberQuestionsDid) {
    return {
      error: "numberQuestionsGot cannot be greater than numberQuestionsDid",
    };
  }

  const scorePercent =
    numberQuestionsDid === 0
      ? 0
      : Number(((numberQuestionsGot / numberQuestionsDid) * 100).toFixed(2));

  return {
    category,
    numberQuestionsDid,
    numberQuestionsGot,
    scorePercent,
  };
};

const createQuizHistory = async (req, res) => {
  const payload = buildQuizHistoryPayload(req.body);

  if (payload.error) {
    return res.status(400).json({ message: payload.error });
  }

  try {
    const quizHistory = await QuizHistory.create({
      user: req.user.id,
      ...payload,
    });

    return res.status(201).json(quizHistory);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save quiz history" });
  }
};

const getMyQuizHistory = async (req, res) => {
  const category =
    typeof req.query.category === "string" ? req.query.category.trim() : "";
  const query = { user: req.user.id };

  if (category) {
    query.category = category;
  }

  try {
    const history = await QuizHistory.find(query).sort({ createdAt: -1 });
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch quiz history" });
  }
};

const updateQuizHistory = async (req, res) => {
  const { historyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(historyId)) {
    return res.status(400).json({ message: "Invalid history id" });
  }

  const payload = buildQuizHistoryPayload(req.body);

  if (payload.error) {
    return res.status(400).json({ message: payload.error });
  }

  try {
    const updated = await QuizHistory.findOneAndUpdate(
      { _id: historyId, user: req.user.id },
      payload,
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Quiz history not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update quiz history" });
  }
};

const deleteQuizHistory = async (req, res) => {
  const { historyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(historyId)) {
    return res.status(400).json({ message: "Invalid history id" });
  }

  try {
    const deleted = await QuizHistory.findOneAndDelete({
      _id: historyId,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Quiz history not found" });
    }

    return res.json({ message: "Quiz history deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete quiz history" });
  }
};

const getMyBestQuizStats = async (req, res) => {
  try {
    const bestByCategory = await QuizHistory.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $sort: {
          scorePercent: -1,
          numberQuestionsGot: -1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: "$category",
          bestAttempt: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          bestAttempt: 1,
        },
      },
      { $sort: { category: 1 } },
    ]);

    if (bestByCategory.length === 0) {
      return res.status(404).json({ message: "No quiz history found" });
    }

    const bestOverall = bestByCategory
      .map((entry) => entry.bestAttempt)
      .sort((a, b) => {
        if (b.scorePercent !== a.scorePercent)
          return b.scorePercent - a.scorePercent;
        if (b.numberQuestionsGot !== a.numberQuestionsGot) {
          return b.numberQuestionsGot - a.numberQuestionsGot;
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      })[0];

    return res.json({
      bestOverall,
      bestByCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch best quiz stats" });
  }
};

const getMyOverallRank = async (req, res) => {
  try {
    const rankings = await QuizHistory.aggregate([
      {
        $group: {
          _id: "$user",
          totalAttempts: { $sum: 1 },
          totalQuestionsDid: { $sum: "$numberQuestionsDid" },
          totalQuestionsGot: { $sum: "$numberQuestionsGot" },
          bestScore: { $max: "$scorePercent" },
          averageScore: { $avg: "$scorePercent" },
        },
      },
      {
        $sort: {
          bestScore: -1,
          totalQuestionsGot: -1,
          averageScore: -1,
          _id: 1,
        },
      },
    ]);

    const currentUserId = req.user.id;
    const userIndex = rankings.findIndex(
      (entry) => entry._id.toString() === currentUserId,
    );

    if (userIndex === -1) {
      return res
        .status(404)
        .json({ message: "No ranking data found for this user" });
    }

    const leaderboard = await QuizHistory.aggregate([
      {
        $group: {
          _id: "$user",
          totalAttempts: { $sum: 1 },
          totalQuestionsGot: { $sum: "$numberQuestionsGot" },
          bestScore: { $max: "$scorePercent" },
          averageScore: { $avg: "$scorePercent" },
        },
      },
      {
        $sort: {
          bestScore: -1,
          totalQuestionsGot: -1,
          averageScore: -1,
          _id: 1,
        },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: {
            $let: {
              vars: {
                safeEmail: {
                  $ifNull: [{ $arrayElemAt: ["$user.email", 0] }, "unknown"],
                },
              },
              in: { $arrayElemAt: [{ $split: ["$$safeEmail", "@"] }, 0] },
            },
          },
          totalAttempts: 1,
          totalQuestionsGot: 1,
          bestScore: { $round: ["$bestScore", 2] },
          averageScore: { $round: ["$averageScore", 2] },
        },
      },
    ]);

    const userStats = rankings[userIndex];

    return res.json({
      rank: userIndex + 1,
      totalRankedUsers: rankings.length,
      stats: {
        totalAttempts: userStats.totalAttempts,
        totalQuestionsDid: userStats.totalQuestionsDid,
        totalQuestionsGot: userStats.totalQuestionsGot,
        bestScore: Number(userStats.bestScore.toFixed(2)),
        averageScore: Number(userStats.averageScore.toFixed(2)),
      },
      leaderboard,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ranking" });
  }
};

module.exports = {
  createQuizHistory,
  getMyQuizHistory,
  updateQuizHistory,
  deleteQuizHistory,
  getMyBestQuizStats,
  getMyOverallRank,
};
