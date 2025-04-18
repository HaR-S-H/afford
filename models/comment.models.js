import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postid: Number,
   comments:[]
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;