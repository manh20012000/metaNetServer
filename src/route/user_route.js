import {
  login,
  register,
  update_user,
  forgetPassword,
  refreshToken,
  loginwithGoogle,
  fcmtoken,
  userfindText,
} from "../controller/user_controller.js";
import express from "express";
import multer from "multer";
import uuid from "react-uuid";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatar_user/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
      "-" +
      uuid().substring(0, 8) +
      path.extname(file.originalname)
    );
  },
});
const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
let upload = multer({ storage: storage, imageFilter: imageFilter });

const user = express();

user.post("/user/login", upload.none(), login);
user.post("/user/register", upload.none(), register);
user.post("/user/update_user/:id", update_user);
user.post("/user/send-forget", forgetPassword);
user.post("/api/user/siginGoogle", loginwithGoogle);
user.post("/user/refreshToken", refreshToken);
user.put("/user/fcmtoken/:id", fcmtoken);
user.get("/getMention", userfindText);
user.post("/user/get_all_user", async (req, res) => {
  console.log("hâhahah");
  return res.status(200).json({ mess: "lấy thành coong" });
});
user.options("/user/fcmtoken");

export default user;
