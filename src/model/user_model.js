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
    enum: ["Respons", "Flow", "Rejected", null, "Can't request"],
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
    phone: { type: String },
    lastname: { type: String },
    firstname: { type: String },
    birthday: { type: String },
    gender: { type: String },
    bio: { type: String },
    avatar: { type: String },
    cover_photo: { type: String },
    password: { type: String },
    fcmToken: [{ type: String }],
    post_cout: { type: Number },
    isVerified: { type: Boolean, default: false },
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
    number_follower: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", user_shema);
