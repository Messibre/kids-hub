const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret } = require("../utils/jwtConfig");

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidPassword = (password) =>
  typeof password === "string" && password.length >= 6;

const register = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const { password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  if (!isValidPassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({
      email: { $regex: `^${escapeRegex(email)}$`, $options: "i" },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ sub: user._id.toString(), email }, jwtSecret, {
      expiresIn: "30d",
    });
    return res.json({ token, email });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const { password } = req.body;

  if (!email || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({
      email: { $regex: `^${escapeRegex(email)}$`, $options: "i" },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ sub: user._id.toString(), email }, jwtSecret, {
      expiresIn: "30d",
    });
    return res.json({ token, email });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
};
