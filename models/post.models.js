import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    id:Number,
    userid:String,
    content:String,
});

const Post = mongoose.model("Post", postSchema);
export default Post;
