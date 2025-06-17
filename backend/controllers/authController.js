const { oauth2client } = require("../utils/googleConfig");
const axios = require("axios");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Utility function to generate tokens
const generateTokens = (userId, email) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Short-lived access token
  );

  const refreshToken = jwt.sign(
    { userId, email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Longer-lived refresh token
  );

  return { accessToken, refreshToken };
};

const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    // Get tokens from Google
    const googleRes = await oauth2client.getToken(code);
    const { tokens } = googleRes;
    oauth2client.setCredentials(tokens);

    // Get user info from Google
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        params: { alt: "json" },
      }
    );

    // Log complete Google response to see all available fields
    console.log(
      "Complete Google User Info:",
      JSON.stringify(
        {
          id: userRes.data.id, // This is the Google ID
          sub: userRes.data.sub, // This is also the Google ID (in some responses)
          email: userRes.data.email,
          name: userRes.data.name,
          picture: userRes.data.picture,
          verified_email: userRes.data.verified_email,
        },
        null,
        2
      )
    );

    const { email, name, picture, id: googleId } = userRes.data;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
        googleId,
        loginProvider: "google",
      });
    } else {
      // Update existing user's info
      user.image = picture;
      user.googleId = googleId;
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate our own JWT tokens
    const { accessToken, refreshToken } = generateTokens(user._id, email);

    // Update user's refresh token in database
    await User.findByIdAndUpdate(user._id, {
      refreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      lastLogin: new Date(),
    });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token is still valid
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken,
      refreshTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Set new access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Remove refresh token from database
      await User.findOneAndUpdate(
        { refreshToken },
        {
          $unset: { refreshToken: 1, refreshTokenExpiresAt: 1 },
        }
      );
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user is already available from authMiddleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  googleLogin,
  refreshAccessToken,
  logout,
  getMe,
};
