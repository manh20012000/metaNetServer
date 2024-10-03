import user_shema from "../model/user_model.js";
import express from "express";
import bcrypt from "bcrypt";
import {
  genneratefreshTokenAndsetCookie,
  gennerateTokenAndsetCookie,
} from "../util/genarate_Token.js";
// const user = express();
const login = async (req, res) => {
  try {
    const data = req.body;
    // check input
    if (!data.email || !data.password) {
      return res.status(400).json({
        success: false,
        message: "Missing required information",
      });
    }

    const user = await user_shema.findOne({ email: data.email });
    // check user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong password",
      });
    }
    // not return password
    const { password, fcmToken, ...userData } = user.toObject();

    // generate access token
    const accessToken = gennerateTokenAndsetCookie(user._id, res);

    // generate refresh token
    const refreshToken = genneratefreshTokenAndsetCookie(user._id, res);
    // success response
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        userData,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const register = async (req, res) => {};
const update_user = async (req, res) => {};
export { login, register, update_user };
