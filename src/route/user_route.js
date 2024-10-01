import { login, register, update_user } from "../controller/user_controller.js";
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

user.post("/user/login", login);
user.post("/user/register", upload.single("avatar"), register);
user.post("/user/update_user/:id", update_user);
user.put("/user/refreshToken");
user.options("/user/fcmtoken");
export default user;
