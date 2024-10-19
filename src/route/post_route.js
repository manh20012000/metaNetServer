import express from "express";
import uploads from "../confige/multerConfig.js";
import {
  createNewPost,
  deletePost,
  getDetailOfPost,
  updatePost,
} from "../controller/post_controller.js";

const postRoutes = express.Router();

postRoutes.post("/create-post", uploads.array("files", 20), createNewPost);

postRoutes.get("/detail-post/:postId", getDetailOfPost);
postRoutes.put(
  "/update-post/:postId",
  uploads.array("ArayImages", 15),
  updatePost
);
postRoutes.delete("/delete-post/:postId", deletePost);

export default postRoutes;
