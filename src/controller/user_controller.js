import user_shema from "../model/user_model.js";
import express from "express";
import bcrypt from "bcrypt";
import {
  genneratefreshTokenAndsetCookies,
  gennerateTokenAndsetCookies,
} from "../util/genarate_Token.js";
import twilio from "twilio";
const user = express();
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
    const accessToken = gennerateTokenAndsetCookies(user._id, res);

    // generate refresh token
    const refreshToken = genneratefreshTokenAndsetCookies(user._id, res);
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

const register = async (req, res) => {
  // const filePath = req.file.filename;
  // let infor = {
  //   protocol: req.protocol,
  //   host: req.get("host"),
  // };
  // const avatarpath = `${infor.protocol}://${infor.host}/avatar_user/${filePath}`;

  const saltRounds = 10;
  const {
    email,
    phone,
    lastname,
    firstname,
    birthday,
    gender,
    avatar,
    password,
  } = req.body;
  try {
    console.log(req.body, "password");
    const find_user = await user_shema.findOne({ email: email });
    if (find_user)
      return res
        .status(301)
        .json({ message: "user này đã tồn tại?", status: 301 });
    else {
      const passw = await bcrypt.hash(password, saltRounds);
      const Register = new user_shema({
        email: email ?? " ",
        phone: phone ?? " ",
        lastname: lastname ?? " ",
        firstname: firstname ?? " ",
        birthday: birthday ?? " ",
        gender: gender ?? " ",
        Taikhoan: email ?? " ",
        avatar: avatar ?? " ",
        password: passw ?? " ",
        fcmToken: [],
      }).save();
      console.log("thành công");
      return res
        .status(201)
        .json({ message: "đăng ký thành công", status: 201 });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "lỗi " + error, status: 500 });
  }
};
const update_user = async (req, res) => {};
const forgetPassword = async (req, res) => {
  const { numberRandom, numberPhone } = req.body;
  try {
    const finuser = user_shema.findOne({ phone: numberPhone });
    if (!finuser)
      return res.status(404).json({ message: "not found phoneNumber" });
    else if (finuser) {
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};
export { login, register, update_user, forgetPassword };
