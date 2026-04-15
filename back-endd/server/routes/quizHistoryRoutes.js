const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createQuizHistory,
  getMyQuizHistory,
  updateQuizHistory,
  deleteQuizHistory,
  getMyBestQuizStats,
  getMyOverallRank,
} = require("../controllers/quizHistoryController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createQuizHistory);
router.get("/me", getMyQuizHistory);
router.get("/me/best", getMyBestQuizStats);
router.get("/me/rank", getMyOverallRank);
router.put("/:historyId", updateQuizHistory);
router.delete("/:historyId", deleteQuizHistory);

module.exports = router;
