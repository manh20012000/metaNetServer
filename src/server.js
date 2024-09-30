import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

dotenv.config();
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`listening on port :${port}`);
});
export { io, app, server, express };
