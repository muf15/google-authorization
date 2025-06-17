const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token not found",
      });
    }

    try {
      // Verify access token
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      // Find user
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "User not found or inactive",
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      // If access token is expired, client should use refresh token endpoint
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token expired",
          code: "TOKEN_EXPIRED",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Middleware for role-based access control
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole,
};
