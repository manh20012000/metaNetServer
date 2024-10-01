import user_shema from "../model/user_model.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  gennerateTokenAndsetCookies,
  genneratefreshTokenAndsetCookies,
} from "../util/genarate_Token.js";

const user = express();
const login = async (req, res) => {};
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
export { login, register, update_user };
