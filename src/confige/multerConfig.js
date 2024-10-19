
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Cấu hình lưu trữ Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        uuidv4().substring(0, 8) +
        path.extname(file.originalname)
    );
  },
});

// Chỉ định các file hợp lệ (ảnh/video)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mp4|MPEG-4|mkv/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed."));
  }
};

// Sử dụng Multer
const uploads = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // Giới hạn kích thước file 500MB
  fileFilter,
});
export default uploads;
