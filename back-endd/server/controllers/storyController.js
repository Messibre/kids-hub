const Story = require("../models/Story");

const getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    return res.json(stories);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch stories" });
  }
};

const createStory = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newStory = new Story({ title, content, author });
    await newStory.save();
    return res.status(201).json(newStory);
  } catch (error) {
    return res.status(400).json({ error: "Failed to add story" });
  }
};

module.exports = {
  getStories,
  createStory,
};
