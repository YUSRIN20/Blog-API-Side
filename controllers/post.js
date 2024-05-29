// import { db } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import Post from "../models/Post.js";
import mongoose from "mongoose";

dotenv.config()

export const getAllPosts = async (req, res) => {
     
    try {
        const posts  = req.query.cat
        ? await Post.find({cat:req.query.cat})
        : await Post.find()

        return res.status(200).json(posts)

    } catch (err) {
        return res.status(500).json(err)
    }

    // const q = req.query.cat
    //     ? "SELECT * FROM posts WHERE cat=?"
    //     : "SELECT * FROM posts";

    // db.query(q, [req.query.cat], (err, data) => {
    //     if (err) return res.status(500).send(err);

    //     return res.status(200).json(data);
    // });
};
export const getPost = async(req, res) => {

    const postId = req.params.id;

    try {
        const post  = await Post.findById(postId).populate('uid','username img')

        if(!post){
            return res.status(404).json({error:"Post not found"})
        }

        const {username,img:userImg} =  post.uid._doc;
        const postData = {
            id: post._id,
            username: username,
            title: post.title,
            desc: post.desc,
            img: post.img,
            userImg: userImg,
            cat: post.cat,
            date: post.date
        }
        return res.status(200).json(postData)
    } catch (err) {
        console.error("Error fetching post:", err);
        return res.status(500).json({ err: "Failed to fetch post" });
    }

    // const postId = req.params.id;
    // const q = `
    //     SELECT p.id, u.username, p.title, p.desc, p.img, u.img AS userImg , p.cat, p.date 
    //     FROM users u 
    //     JOIN posts p ON u.id = p.uid 
    //     WHERE p.id = ?
    // `;

    // db.query(q, [postId], (err, data) => {
    //     if (err) {
    //         console.error("Error fetching post:", err);
    //         return res.status(500).json({ error: "Failed to fetch post" });
    //     }

    //     if (data.length === 0) {
    //         return res.status(404).json({ error: "Post not found" });
    //     }

    //     return res.status(200).json(data[0]);
    // });
};

export const addPost = async (req, res) => {
    
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json("Not authenticated!");
    try {

        const userInfo =  jwt.verify(token,process.env.JWT)
        
        const newPost = new Post({
            title: req.body.title,
            desc: req.body.desc,
            img: req.body.img,
            cat: req.body.cat,
            date: req.body.date,
            uid: userInfo.id
        });

        await newPost.save()
        return res.json("Post has been created")
        
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json("Token is not valid!");
        }
        return res.status(500).json(err)
    }

    // const token = req.cookies.access_token;

    // if (!token) return res.status(401).json("Not authenticated!");

    // jwt.verify(token, "JWTKEY", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");


    //     const q = "INSERT INTO posts (`title`,`desc`,`img`,`cat`,`date`,`uid`) VALUES (?)"

    //     const values =[
    //         req.body.title,
    //         req.body.desc,
    //         req.body.img,
    //         req.body.cat,
    //         req.body.date,
    //         userInfo.id
    //     ]

    //     db.query(q,[values],(err,data)=>{
    //         if (err) return res.status(500).json(err);
    //         return res.json("Post has been created.")
    //     })
    // });
};

export const deletePost = async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json("Not authenticated!");
    }

    jwt.verify(token, process.env.JWT, async (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid!");
        }

        const postId = req.params.id;

        // Validate postId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        try {
            const post = await Post.findOne({ _id: postId, uid: userInfo.id });

            if (!post) {
                return res.status(403).json("You can delete only your post!");
            }

            await Post.deleteOne({ _id: postId, uid: userInfo.id });

            return res.json("Post has been deleted!");
        } catch (error) {
            console.error("Error deleting post:", error);
            return res.status(500).json({ error: "Failed to delete post" });
        }
    });
    // const token = req.cookies.access_token;

    // if (!token) return res.status(401).json("Not authenticated!");

    // jwt.verify(token, "JWTKEY", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");

    //     const postId = req.params.id;
    //     const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    //     db.query(q, [postId, userInfo.id], (err, data) => {
    //         if (err) return res.status(403).json("You can delete only your post!");

    //         return res.json("Post has been deleted!");
    //     });
    // });
};

export const updatePost =async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json("Not authenticated!");
    }

    jwt.verify(token,process.env.JWT, async (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid!");
        }

        const postId = req.params.id;

        // Validate postId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const updateData = {
            title: req.body.title,
            desc: req.body.desc,
            img: req.body.img,
            cat: req.body.cat
        };

        try {
            const post = await Post.findOneAndUpdate(
                { _id: postId, uid: userInfo.id },
                { $set: updateData },
                { new: true }
            );

            if (!post) {
                return res.status(403).json("You can update only your post!");
            }

            return res.json("Post has been updated.");
        } catch (error) {
            console.error("Error updating post:", error);
            return res.status(500).json({ error: "Failed to update post" });
        }
    });
    // const token = req.cookies.access_token;

    // if (!token) return res.status(401).json("Not authenticated!");

    // jwt.verify(token, "JWTKEY", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");

    //     const postId  = req.params.id
    //     const q = "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?"

    //     const values =[
    //         req.body.title,
    //         req.body.desc,
    //         req.body.img,
    //         req.body.cat,
    //     ]

    //     db.query(q,[...values,postId,userInfo.id],(err,data)=>{
    //         if (err) return res.status(500).json(err);
    //         return res.json("Post has been updated.")
    //     })
    // });

};
