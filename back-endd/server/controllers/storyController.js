const Story = require("../models/Story");
const mongoose = require("mongoose");

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePagination = (query) => {
  const page = parsePositiveInt(query.page, 1);
  const limit = Math.min(parsePositiveInt(query.limit, 20), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const buildStoryQuery = (query) => {
  const mongoQuery = {};
  const search = typeof query.q === "string" ? query.q.trim() : "";
  const author = typeof query.author === "string" ? query.author.trim() : "";

  if (search) {
    const safeSearch = escapeRegex(search);
    mongoQuery.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { content: { $regex: safeSearch, $options: "i" } },
      { author: { $regex: safeSearch, $options: "i" } },
    ];
  }

  if (author) {
    const safeAuthor = escapeRegex(author);
    mongoQuery.author = { $regex: `^${safeAuthor}$`, $options: "i" };
  }

  return mongoQuery;
};

const validateStoryPayload = (body) => {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const author = typeof body.author === "string" ? body.author.trim() : "";

  if (!title) {
    return { error: "Title is required" };
  }

  if (!content) {
    return { error: "Content is required" };
  }

  return {
    title,
    content,
    author: author || "Anonymous",
  };
};

const getStories = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const mongoQuery = buildStoryQuery(req.query);

  try {
    const [stories, total] = await Promise.all([
      Story.find(mongoQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Story.countDocuments(mongoQuery),
    ]);

    return res.json({
      items: stories,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch stories" });
  }
};

const searchStories = async (req, res) => {
  return getStories(req, res);
};

const getStoryById = async (req, res) => {
  const { storyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    return res.status(400).json({ error: "Invalid story id" });
  }

  try {
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    return res.json(story);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch story" });
  }
};

const createStory = async (req, res) => {
  const payload = validateStoryPayload(req.body);

  if (payload.error) {
    return res.status(400).json({ error: payload.error });
  }

  try {
    const newStory = new Story(payload);
    await newStory.save();
    return res.status(201).json(newStory);
  } catch (error) {
    return res.status(400).json({ error: "Failed to add story" });
  }
};

const createMyStory = async (req, res) => {
  const payload = validateStoryPayload(req.body);

  if (payload.error) {
    return res.status(400).json({ error: payload.error });
  }

  try {
    const newStory = new Story({
      ...payload,
      author: payload.author === "Anonymous" ? req.user.email : payload.author,
      user: req.user.id,
    });

    await newStory.save();
    return res.status(201).json(newStory);
  } catch (error) {
    return res.status(400).json({ error: "Failed to add personal story" });
  }
};

const getMyStories = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const mongoQuery = {
    user: req.user.id,
    ...buildStoryQuery(req.query),
  };

  try {
    const [stories, total] = await Promise.all([
      Story.find(mongoQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Story.countDocuments(mongoQuery),
    ]);

    return res.json({
      items: stories,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch your stories" });
  }
};

const updateMyStory = async (req, res) => {
  const { storyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    return res.status(400).json({ error: "Invalid story id" });
  }

  const payload = validateStoryPayload(req.body);

  if (payload.error) {
    return res.status(400).json({ error: payload.error });
  }

  try {
    const story = await Story.findOneAndUpdate(
      { _id: storyId, user: req.user.id },
      payload,
      { new: true },
    );

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    return res.json(story);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update story" });
  }
};

const deleteMyStory = async (req, res) => {
  const { storyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    return res.status(400).json({ error: "Invalid story id" });
  }

  try {
    const story = await Story.findOneAndDelete({
      _id: storyId,
      user: req.user.id,
    });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    return res.json({ message: "Story deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete story" });
  }
};

const getMyStoriesStats = async (req, res) => {
  try {
    const stats = await Story.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: "$author",
          storiesCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          author: "$_id",
          storiesCount: 1,
        },
      },
      { $sort: { storiesCount: -1, author: 1 } },
    ]);

    const totalStories = stats.reduce((sum, row) => sum + row.storiesCount, 0);
    return res.json({ totalStories, byAuthorName: stats });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch story stats" });
  }
};

module.exports = {
  getStories,
  searchStories,
  getStoryById,
  createStory,
  createMyStory,
  getMyStories,
  updateMyStory,
  deleteMyStory,
  getMyStoriesStats,
};
