const { googleLogin } = require("../controllers/authController");
const router = require("express").Router();

router.get("/test", (req, res) => {
    return res.json("test passed!");
});

router.post("/google", googleLogin);

module.exports = router;