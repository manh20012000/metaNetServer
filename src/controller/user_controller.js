import user from "../model/user_model.js";
import express from "express";
import bcrypt from "bcrypt";
import {
  genneratefreshTokenAndsetCookies,
  gennerateTokenAndsetCookies,
} from "../util/genarate_Token.js";
import twilio from "twilio";

const login = async (req, res) => {
  try {
    const data = req.body;

    if (!data.email || !data.password) {
      return res.status(400).json({
        success: false,
        message: "Missing required information",
      });
    }

    // tìm bằng cả số điện thoại hoặc tìm bằng cả email
    const users = await user.findOne({
      $or: [{ email: data.email }, { phone: data.email }],
    });

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }
    // compare password
    const isMatch = await bcrypt.compare(data.password, users.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không hợp lệ",
      });
    }
    // not return password
    const { password, fcmToken, ...userData } = users.toObject();
    // generate access token
    const accessToken = gennerateTokenAndsetCookies(users._id, res);
    // generate refresh token
    const refreshToken = genneratefreshTokenAndsetCookies(users._id, res);
    // success response
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        _id: users._id,
        name: users.lastname + " " + users.firstname,
        avatar: users.avatar,
        email: users.email,
        fcmToken: users.fcmToken,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error" + error,
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
const loginwithGoogle = async (req, res) => {
  const users = req.body;

  const userfind = await User.findOne({ email: users.email });
  if (userfind) {
    const accessToken = gennerateTokenAndsetCookies(users._id, res);
    const refreshToken = genneratefreshTokenAndsetCookies(users._id, res);
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",

      data: {
        _id: userfind._id,
        name: userfind.lastname + " " + userfind.firstname,
        avatar: userfind.avatar,
        email: userfind.email,
        fcmToken: userfind.fcmToken,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  }
  if (!userfind) {
    const userGoogole = {
      email: users.email ?? " ",
      lastname: users.lastname ?? " ",
      firstname: users.firstname ?? " ",
      birthday: users.birthday ?? " ",
      gender: users.gender ?? " ",
      avatar: users.avatar ?? " ",
      fcmToken: user.fcmtoken ?? [],
    };

    const newUser = await User.create(userGoogole);
    const ascesstoken = await gennerateTokenAndsetCookies(newUser._id, res);
    const refreshtoken = await genneratefreshTokenAndsetCookies(
      newUser._id,
      res
    );
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        data: {
          _id: newUser._id,
          name: newUser.lastname + " " + newUser.firstname,
          avatar: newUser.avatar,
          email: newUser.email,
          fcmToken: newUser.fcmToken,
          accessToken: ascesstoken,
          refreshToken: refreshtoken,
        },
      },
    });
  } else {
    return res.status(404).json({ message: "not found user" });
  }
};
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ err: "No refresh token provided" });
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(404).json({ err: "authorized- invalid Token" });
  }

  const users = await user.findById(decoded.userId).select("-Matkhau");
  if (!users) {
    return res.status(404).json({ err: "user Notfound" });
  }

  let token = gennerateTokenAndsetCookies(users._id, res);
  return res.status(200).json({
    data: {
      _id: users._id,
      name: users.lastname + " " + users.firstname,
      avatar: users.avatar,
      email: users.email,
      fcmToken: users.fcmToken,
      accessToken: token,
      refreshToken: refreshToken,
    },
    msg: "OK",
    status: 200,
  });
};
const fcmtoken = async (req, res) => {
  const User_id = req.params.id;
  const fcmtoken = req.body.fcmtoken;

  try {
    const users = await user.findByIdAndUpdate(
      User_id,
      { fcmToken: fcmtoken },
      { new: true, select: "-password" }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      data: {
        _id: users._id,
        name: users.lastname + " " + users.firstname,
        avatar: users.avatar,
        email: users.email,
        fcmToken: users.fcmToken,
      },
      message: "OK",
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const userfindText = async (req, res) => {
  try {
    const { keyword } = req.params; // Lấy giá trị name từ query params
    const { _id } = req.query;
    console.log(keyword);
    if (!keyword) {
      return res
        .status(400)
        .json({ error: "Name query parameter is required" });
    }
    if (keyword === "@") {
      // Nếu name là '@', lấy 15 người từ danh sách friendRequest
      const friends = await user
        .findById(_id)
        .select("following") // Chỉ lấy trường following
        .populate({
          path: "following", // Populate những người mà user đang follow
          select: "id lastname firstname avatar", // Chọn các trường cần thiết từ người dùng được follow
          options: { limit: 15 }, // Giới hạn 15 kết quả
        })
        .exec();
      console.log(friends);
      // Định dạng dữ liệu trả về
      const formattedFriends = friends.following.map((friend) => ({
        id: friend.id,
        name: `${friend.lastname} ${friend.firstname}`,
        avatar: friend.avatar,
      }));

      return res
        .status(200)
        .json({ message: "success", status: 200, data: formattedFriends });
    } else if (keyword.startsWith("@")) {
      // Sử dụng regex để tìm kiếm gần đúng cho lastname hoặc firstname
      console.log("ạdjsnjd");
      const searchKeyword = keyword.slice(1);
      const users = await user.find({
        $or: [
          { lastname: { $regex: searchKeyword, $options: "i" } },
          { firstname: { $regex: searchKeyword, $options: "i" } },
        ],
      })
        .limit(20) // Giới hạn kết quả trả về 20 người
        .select("id lastname firstname avatar") // Chọn các trường cần thiết
        .exec();
 
      // Định dạng dữ liệu trả về theo yêu cầu
      const formattedUsers = users.map((user) => ({
        id: user.id,
        name: `${user.lastname} ${user.firstname}`,
        avatar: user.avatar,
      }));

      return res.status(200).json({
        message: "success",
        status: 200,
        data: formattedUsers,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  login,
  register,
  update_user,
  forgetPassword,
  refreshToken,
  loginwithGoogle,
  fcmtoken,
  userfindText,
};
