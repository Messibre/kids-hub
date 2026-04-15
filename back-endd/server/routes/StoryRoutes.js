const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getStories,
  searchStories,
  getStoryById,
  createStory,
  createMyStory,
  getMyStories,
  updateMyStory,
  deleteMyStory,
  getMyStoriesStats,
} = require("../controllers/storyController");

router.get("/", getStories);
router.get("/search", searchStories);
router.post("/", createStory);

router.get("/me/list", authMiddleware, getMyStories);
router.get("/me/stats", authMiddleware, getMyStoriesStats);
router.post("/me", authMiddleware, createMyStory);
router.put("/me/:storyId", authMiddleware, updateMyStory);
router.delete("/me/:storyId", authMiddleware, deleteMyStory);
router.get("/:storyId", getStoryById);

module.exports = router;
