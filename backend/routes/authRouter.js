const {
  googleLogin,
  getMe,
  logout,
  refreshAccessToken,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = require("express").Router();

// Test route
router.get("/test", (req, res) => {
  return res.json("test passed!");
});

// Auth routes
router.post("/login", googleLogin); // Initial Google OAuth login
router.post("/refresh-token", refreshAccessToken); // Get new access token using refresh token
router.get("/me", authMiddleware, getMe); // Get current user info (protected)
router.post("/logout", authMiddleware, logout); // Logout (protected)

module.exports = router;
