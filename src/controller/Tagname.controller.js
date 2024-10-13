import Tagname from "../model/Tagname.js";
const getTagName = async (req, res) => {
  try {
    // const keyword = req.params.keyword;
    console.log(req.params)
    const keyword = req.query.keyword;
    const key = keyword.replace("#", "");
    const tags = await Tagname.find({
      name: { $regex: key, $options: "i" }, // Tìm theo từ khóa không phân biệt hoa thường
    });
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error("Error fetching tag names:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching tag names" });
  }
};
const addTagname = async (req, res, next) => {
  try {
    const { hagtag } = req.body;

    // Kiểm tra xem tag đã tồn tại hay chưa
    const existingTag = await Tagname.findById(hagtag.id);
    if (existingTag) {
      return res
        .status(400)
        .json({ success: false, message: "Tagname already exists" });
    }

    // Tạo mới một tagname
    const newTag = new Tagname({
      id: hagtag.id,
      name: hagtag.name.replace("#", ""),
      createdBy: hagtag._id,
    });
    // Lưu vào cơ sở dữ liệu
    await newTag.save();

    res.status(201).json({ success: true, results: newTag });
  } catch (error) {
    console.error("Error adding tag name:", error);
    res.status(500).json({ success: false, message: "Error adding tag name" });
  }
};
export { getTagName, addTagname };
