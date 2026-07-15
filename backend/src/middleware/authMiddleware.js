const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.group("========== AUTH MIDDLEWARE ==========");
  console.log("URL:", req.originalUrl);
  console.log("METHOD:", req.method);
  console.log("Authorization Header:", req.headers.authorization);
  console.log("All Headers:", req.headers);
  console.trace();
  console.groupEnd();

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.error("❌ NO TOKEN FOUND - Returning 401");
      return res.status(401).json({
        message: "Access denied"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("✅ Token decoded successfully:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

module.exports = authMiddleware;