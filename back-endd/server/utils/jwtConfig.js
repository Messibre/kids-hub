const isProduction = process.env.NODE_ENV === "production";
const jwtSecret = process.env.JWT_SECRET || "kids-hub-dev-only-secret";

if (!process.env.JWT_SECRET && isProduction) {
  throw new Error("JWT_SECRET is required in environment variables");
}

module.exports = {
  jwtSecret,
};
