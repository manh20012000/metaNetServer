import { io, express } from "./server";
import jwt from "jsonwebtoken";
import {
  pushSocketIDToArray,
  removeSocketIDFromArray,
} from "../src/util/socket_util.js";
import user_model from "./model/user_model.js";


let clients = {};
export const getReciverSocketId = (receiverId) => {
  return clients[receiverId];
};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        socket.userId = decoded.userId;
      }
    });
  }
  return next();
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected`);
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    clients = removeSocketIDFromArray(clients, socket?.userId, socket);
    let listUserIdOnline = Object.keys(clients);
    socket.broadcast.emit("server-send-when-has-user-online", listUserIdOnline);
    console.log("ngat ket noi");
  });

  if (!socket?.userId) {
    return;
  }
 clients = pushSocketIDToArray(clients, socket?.userId, socket.id);

let listUserIdOnline = Object.keys(clients);
  // console.log(listUserIdOnline,'hhhhh')
  socket.emit("UserOnline", listUserIdOnline);
  // Gửi id người dùng vừa online có tất cả user khác
  socket.broadcast.emit("server-send-when-has-user-online", listUserIdOnline);
});