const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const uploadPaintingImage = require("../middleware/uploadPaintingMiddleware");
const {
  createPainting,
  getMyPaintings,
  getMyPaintingById,
  updateMyPainting,
  deleteMyPainting,
} = require("../controllers/paintingController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", uploadPaintingImage, createPainting);
router.get("/", getMyPaintings);
router.get("/:paintingId", getMyPaintingById);
router.patch("/:paintingId", updateMyPainting);
router.delete("/:paintingId", deleteMyPainting);

module.exports = router;
