import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    post_content: {
        type: String,
    },
    file: [{
        typefile: { type: String, required: true },
        imageUrl: { type: String, required: true },
    }],
    feel: {
        type: String,
    },
    like: [{
        user: {
            type: mongoose.Types.ObjectId,
            ref: "user",
        },
        like_emoji: {
            type: String,
            default: "like",
        },
    }, ],
    count_like: {
        type: Number,
        default: 0,
    },
    count_comment: {
        type: Number,
        default: 0,
    },
    is_show: {
        type: Boolean,
        default: true,
    },
    propose: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});

//Export the model
export default mongoose.model("Post", postSchema);