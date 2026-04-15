const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const storyRoutes = require("./routes/StoryRoutes");
const authRoutes = require("./routes/authRoutes");
const quizHistoryRoutes = require("./routes/quizHistoryRoutes");
const paintingRoutes = require("./routes/paintingRoutes");

const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173,https://kids-hub-snowy.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools and same-origin server calls.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/kids-hub",
);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});
mongoose.connection.once("open", () => {
  console.log("connected to mongodb:", mongoose.connection.name);
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.use("/api", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/quiz-history", quizHistoryRoutes);
app.use("/api/paintings", paintingRoutes);

const PORT = process.env.PORT || 5050;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
