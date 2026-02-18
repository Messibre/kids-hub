const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const storyRoutes = require("./routes/StoryRoutes");
const jwt = require("jsonwebtoken");

const app = express();
const bcrypt = require("bcryptjs");

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
const isProduction = process.env.NODE_ENV === "production";
const SECRET = process.env.JWT_SECRET || "kids-hub-dev-only-secret";
if (!process.env.JWT_SECRET && isProduction) {
  throw new Error("JWT_SECRET is required in environment variables");
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

app.post("/api/register", async (req, res) => {
  console.log("Register endpoint hit", req.body);
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    console.log("user registered successfully", user);
    const token = jwt.sign({ email }, SECRET, { expiresIn: "30d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ email }, SECRET, { expiresIn: "30d" });
    res.json({ token, email });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.use("/api/stories", storyRoutes);

const PORT = process.env.PORT || 5050;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
