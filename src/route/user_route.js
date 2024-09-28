import { login, register, update_user } from "../controller/user_controller.js";
import express from "express";
const user = express();
user.post("/user/login", login);
user.post("/user/register", register);
user.post("/user/update_user/:id", update_user);
user.put('/user/refreshToken',)
user.options('/user/fcmtoken')
export default user;
