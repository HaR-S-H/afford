import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import Post from "../models/post.models.js";
import User from "../models/user.models.js";
import Comment from "../models/comment.models.js";
const getTopComments = async (req, res) => {
    try {
        let response = await axios.get(process.env.API_URL + "/users", { withCredentials: true });
        let users = response.users;
        let names = [];
        for (let key in users) {
            let user = await User.findOne({ id: key });
            if (!user) {
                user = new User({ id: key, name: users[key] });
                await user.save();
            }
            let response = await axios.get(process.env.API_URL + "/users" `/${key}` + "/posts", { withCredentials: true });
            let Posts = response.posts;
            Posts.map(async (post) => { 
                let userPost = await User.findOne({ id: post.id });
                if (!userPost) {
                     userPost = new Post({ id: post.id, userid: post.userid, content: post.content });
                    await userPost.save();
                }
                let response = await axios.get(process.env.API_URL +"/posts" `/${userPost.postid}` + "/comments", { withCredentials: true });
                let comments = response.comments;
                let comment=await Comment.findOne({ postid: comments[0].postid });
                if (!comment) {
                    comment = new Comment({
                        id: comments[0].postid,
                        comments: comments
                    })
                    await comment.save();
                }
                const topComments = await Comment.aggregate([
                    { $addFields: { commentCount: { $size: "$comments" } } },
                    { $sort: { commentCount: -1 } },
                    { $limit: 5 }
                  ]);
                topComments.map(async(topComment) => {
                    const post = await Post.findOne({ id: topComment.postid });
                    const user = await User.findOne({ id: post.userid });
                    if (user) {
                        names.push(user.name);
                    }
            })
            });

        }
        res.status(400).json({ names });
    } catch (error) {
        console.log("error in readPost controller");
    }
}

export { getTopComments };