import mongoose from "mongoose";
async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://levanmanh:levanmanh2@cluster0.j7q2hxg.mongodb.net/MetaNet`
    );
    console.log("Database: connect");
  } catch (error) {
    console.log("Fail to connect db");
  }
}
export default { connect };
