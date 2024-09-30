import { app, server } from "./server.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./confige/connectDB.js";
import user from "./route/user_route.js";
app.use(cors({ origin: "*" })); // thực hiện cấu hính cho bất kỳ đường dẫn nào cũng có thẻ thực hiện được việc cấu truy cập
app.use(bodyParser.json()); // for JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
connectDB.connect();
app.use("/api", user);
app.get("/", (req, res) => {
  res.send("Hello World! hihi");
});
