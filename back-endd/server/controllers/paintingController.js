const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Painting = require("../models/Painting");

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const parsePagination = (query) => {
  const page = parsePositiveInt(query.page, 1);
  const limit = Math.min(parsePositiveInt(query.limit, 20), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const createPainting = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const title =
    typeof req.body?.title === "string" && req.body.title.trim()
      ? req.body.title.trim()
      : "Untitled painting";

  try {
    const imageUrl = `/uploads/paintings/${req.file.filename}`;

    const painting = await Painting.create({
      user: req.user.id,
      title,
      imageUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    return res.status(201).json(painting);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save painting" });
  }
};

const getMyPaintings = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  try {
    const [items, total] = await Promise.all([
      Painting.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Painting.countDocuments({ user: req.user.id }),
    ]);

    return res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch paintings" });
  }
};

const getMyPaintingById = async (req, res) => {
  const { paintingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    return res.status(400).json({ message: "Invalid painting id" });
  }

  try {
    const painting = await Painting.findOne({
      _id: paintingId,
      user: req.user.id,
    });

    if (!painting) {
      return res.status(404).json({ message: "Painting not found" });
    }

    return res.json(painting);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch painting" });
  }
};

const updateMyPainting = async (req, res) => {
  const { paintingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    return res.status(400).json({ message: "Invalid painting id" });
  }

  const title =
    typeof req.body?.title === "string" && req.body.title.trim()
      ? req.body.title.trim()
      : null;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const painting = await Painting.findOneAndUpdate(
      { _id: paintingId, user: req.user.id },
      { title },
      { new: true },
    );

    if (!painting) {
      return res.status(404).json({ message: "Painting not found" });
    }

    return res.json(painting);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update painting" });
  }
};

const deleteMyPainting = async (req, res) => {
  const { paintingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    return res.status(400).json({ message: "Invalid painting id" });
  }

  try {
    const painting = await Painting.findOneAndDelete({
      _id: paintingId,
      user: req.user.id,
    });

    if (!painting) {
      return res.status(404).json({ message: "Painting not found" });
    }

    const relativePath = painting.imageUrl.startsWith("/")
      ? painting.imageUrl.slice(1)
      : painting.imageUrl;
    const absolutePath = path.join(__dirname, "..", relativePath);

    fs.unlink(absolutePath, () => {
      // Ignore missing file errors and still keep successful DB delete response.
    });

    return res.json({ message: "Painting deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete painting" });
  }
};

module.exports = {
  createPainting,
  getMyPaintings,
  getMyPaintingById,
  updateMyPainting,
  deleteMyPainting,
};
