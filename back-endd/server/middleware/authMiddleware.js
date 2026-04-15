const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret } = require("../utils/jwtConfig");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = jwt.verify(token, jwtSecret);
    const normalizedEmail =
      typeof payload.email === "string"
        ? payload.email.trim().toLowerCase()
        : "";
    const userQuery = payload.sub
      ? { _id: payload.sub }
      : {
          email: {
            $regex: `^${escapeRegex(normalizedEmail)}$`,
            $options: "i",
          },
        };
    const user = await User.findOne(userQuery);

    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
