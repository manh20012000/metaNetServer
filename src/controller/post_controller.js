import Post from "../model/post_model.js";
import uploads from "../confige/multerConfig.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
// create new post
export const createNewPost = async (req, res) => {
    try {
        const data = req.body
        console.log('jajajaj')
        ffmpeg.setFfmpegPath(ffmpegPath);
        if (req.files && req.files.length > 0) {
            let info = {
                protocol: req.protocol,
                host: req.get("host"),
            };
            const hlsOutputPath = "public/hls";

            // Create image paths
            const processedFiles = await Promise.all(
                req.files.map(async (file) => {
                    const fileId = uuidv4(); // tạo id duy nhất cho file
                    if (file.mimetype === "video/mp4") {
                        // Chuyển video sang định dạng m3u8 (HLS)
                        await new Promise((resolve, reject) => {
                            ffmpeg(file.path)
                                .inputFormat("mp4")
                                .outputFormat("hls")
                                .outputOptions([
                                    "-start_number 0",
                                    "-hls_time 6",
                                    "-hls_list_size 4",
                                    "-vf scale=-2:1080",
                                    "-hls_flags single_file",
                                ])
                                .output(`${hlsOutputPath}/${fileId}.m3u8`)
                                .on("error", (err) => {
                                    console.error("Lỗi khi chuyển đổi video:", err);
                                    reject(err);
                                }).on("end", () => {
                                    console.log("Chuyển đổi video thành công");
                                    resolve();
                                })
                                .run();
                        });
                        const originalVideoPath = path.join("public/uploads", file.filename);
                        fs.unlink(originalVideoPath, (err) => {
                            if (err) {
                                console.error("Lỗi khi xóa video gốc:", err);
                            } else {
                                console.log("Đã xóa video gốc thành công");
                            }
                        });

                        return {
                            typefile: file.mimetype,
                            fileUrl: `${info.protocol}://${info.host}/hls/${fileId}.m3u8`,
                        };
                    } else {

                        return {
                            typefile: file.mimetype,
                            fileUrl: `${info.protocol}://${info.host}/uploads/${file.filename}`,
                        };
                    }
                })
            );
            const newPost = await Post.create({
                user: data.user,
                post_content: data.post_content,
                file: processedFiles,
                feel: 'đang cảm thấy bị lệ tráp',
                like: [],
                count_like: 0,
                count_comment: 0,
                is_show: data.is_show,
                propose: '',
                permision: '',
                loaction: data.loaction
            });
            return res.status(200).json({
                success: true,
                message: "Post created successfully",
                data: newPost,
                status: 200
            });
        } else {
            // No files uploaded, create post with data only
            const newPost = await Post.create({
                user: data.user,
                post_content: data.post_content,
                file: [],
                feel: 'đang cảm thấy bị lệ tráp',
                like: [],
                count_like: 0,
                count_comment: 0,
                is_show: '',
                propose: '',
                permision: data.permision,
                loaction: data.loaction
            });

            return res.status(200).json({
                success: true,
                message: "Post created successfully",
                data: newPost,
                status: 200
            });
        }
    } catch (error) {
        console.log(error)
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