const express = require("express");
const router = express.Router();
const { getStories, createStory } = require("../controllers/storyController");

router.get("/", getStories);

router.post("/", createStory);

module.exports = router;
