require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const storyRoutes = require("./routes/StoryRoutes");
const jwt = require("jsonwebtoken");

const app = express();
const bcrypt = require("bcryptjs");

app.use(cors());
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
const SECRET = "your_jwt_secret";

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
    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
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
    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
