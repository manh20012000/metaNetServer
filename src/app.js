import { app, server, express } from "./server.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./confige/connectDB.js";
import user from "./route/user_route.js";
import postRoutes from "./route/post_route.js";
import routeTagname from "./route/tagname.route.js";
app.use(cors({ origin: "*" })); // thực hiện cấu hính cho bất kỳ đường dẫn nào cũng có thẻ thực hiện được việc cấu truy cập
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json()); // for JSON data
app.use(bodyParser.urlencoded({ extended: true }));
connectDB.connect();
app.use("/api", user);
app.use("/api", postRoutes);
app.use("/api", routeTagname);
app.get("/", (req, res) => {
    res.send("Hello World! hihi");
});