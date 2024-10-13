import mongoose from "mongoose";
const Schema = mongoose.Schema;
const tagnameSchema = new mongoose.Schema({
  id: { type: String },
  name: {
    type: String,
    required: true, // Bắt buộc phải có tên tag
    unique: true, // Tên tag phải là duy nhất
    trim: true, // Xóa khoảng trắng ở đầu và cuối
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Tham chiếu đến mô hình User (người tạo tag)
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Tự động lấy thời gian tạo hiện tại
  },
});

// Tạo model cho tagname
export default mongoose.model("Tagname", tagnameSchema);
