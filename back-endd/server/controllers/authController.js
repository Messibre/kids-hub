const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isProduction = process.env.NODE_ENV === "production";
const SECRET = process.env.JWT_SECRET || "kids-hub-dev-only-secret";

if (!process.env.JWT_SECRET && isProduction) {
  throw new Error("JWT_SECRET is required in environment variables");
}

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ email }, SECRET, { expiresIn: "30d" });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
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
    return res.json({ token, email });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
};
