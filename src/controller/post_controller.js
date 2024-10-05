import Post from "../model/post_model.js";
import uploads from "../confige/multerConfig.js";
// create new post
export const createNewPost = async (req, res) => {
  try {
    const data = { ...req.body };

    // Check if there are files uploaded
    if (req.files && req.files.length > 0) {
      await uploads.array("ArayImages", 15)(req, res, async () => {
        const info = {
          protocol: req.protocol,
          host: req.get("host"),
        };

        // Create image paths
        const imagePaths = req.files.map((file) => {
          return `${info.protocol}://${info.host}/uploads/${file.filename}`;
        });

        // Save image paths
        data.image_urls = imagePaths;

        // Create new post with image URLs
        const newPost = await Post.create(data);

        return res.status(200).json({
          success: true,
          message: "Post created successfully",
          data: newPost,
        });
      });
    } else {
      // No files uploaded, create post with data only
      const newPost = await Post.create(data);

      return res.status(200).json({
        success: true,
        message: "Post created successfully",
        data: newPost,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// get detail of one user
export const getDetailOfPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate({
      path: "user",
      select: "firstname lastname avatar",
    });

    // check post
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // response
    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const data = { ...req.body };
    // Check if there are files uploaded
    if (req.files && req.files.length > 0) {
      await uploads.array("ArayImages", 15)(req, res, async () => {
        const info = {
          protocol: req.protocol,
          host: req.get("host"),
        };

        // Create image paths
        const imagePaths = req.files.map((file) => {
          return `${info.protocol}://${info.host}/uploads/${file.filename}`;
        });

        // Save image paths
        data.image_urls = imagePaths;

        // Update post with image URLs
        const updatedPost = await Post.findByIdAndUpdate(postId, data, {
          new: true,
        });

        return res.status(200).json({
          success: true,
          message: "Post updated successfully",
          data: updatedPost,
        });
      });
    } else {
      // No files uploaded, update post with data only
      const updatedPost = await Post.findByIdAndUpdate(postId, data, {
        new: true,
      });

      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
