const { googleLogin, getMe, logout } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.get("/test", (req, res) => {
  return res.json("test passed!");
});

router.post("/google", googleLogin);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

module.exports = router;
