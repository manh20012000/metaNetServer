import mongoose from "mongoose";
const Schema = mongoose.Schema;
const FriendRequest_shema = new Schema({
  from: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },

  status: {
    type: String,
    enum: ["Respons", "Friend", "Rejected", null, "Can't request"],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema cho người dùng
const user_shema = new Schema(
  {
    email: { type: String },
    phone: { type: Number },
     name: { type: String },
    birth: { type: String },
    gender: { type: String },
     
    avatar: { type: String },
    password: { type: String },
    fcmToken: [{ type: String }],
    friend: [
      // cai này co nghĩa la user này đã được thực hiện việc có
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    friendRequests: [FriendRequest_shema], // Sử dụng schema lời mời kết bạn
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    number_friend: {
      type: Number,
      default: 0,
    },
    number_follow: {
      type: Number,
      default: 0,
    },
    like_article: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    like_video: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", user_shema);
