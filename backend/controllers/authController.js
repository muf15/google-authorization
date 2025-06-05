const { oauth2client } = require("../utils/googleConfig");
const axios = require("axios");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    // Log Google's response
    console.log("Google User Info:", userRes.data);

    const { email, name, picture } = userRes.data;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    } else {
      // Update existing user's image if it changed
      user.image = picture;
      await user.save();
    }

    const { _id } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image, // Explicitly include image
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error); // Add detailed logging
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

module.exports = {
  googleLogin,
};
