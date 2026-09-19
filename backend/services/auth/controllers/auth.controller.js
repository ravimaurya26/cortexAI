import crypto from "crypto";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }

    const sessionID = crypto.randomUUID();
    await redis.set(`session:${sessionID}`,JSON.stringify({ 
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    }), 'EX', 60 * 60 * 24 * 7);              // Set session to expire in 7 days

    res.cookie("session", sessionID, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `Login error: ${error.message}`,
    });
  }
}

export const logout = async (req, res) => {
  try {
    const sessionID = req.cookies.session;
    await redis.del(`session:${sessionID}`);    // Delete the session from Redis and cookie
    res.clearCookie("session");
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {

      return res.status(500).json({
      message: `Logout error: ${error.message}`,
    });
  }
}