const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const  dotenv =require( "dotenv");
dotenv.config();

const Http_server = express();

Http_server.use(bodyParser.json());
Http_server.use(cors());
const PORT = 3000

//! connect the mongodb

mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "blogdb",
    })
    .then(() => { 
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
    });


//! Schema

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.model("Post", PostSchema);

//* GET all posts

Http_server.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//* GET single post
Http_server.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) res.json(post);
    else res.status(404).json({ message: "Post not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//* POST new post

Http_server.post("/posts", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//* UPDATE post

Http_server.patch("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (post) res.json(post);
    else res.status(404).json({ message: "Post not found" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//* DELETE post

Http_server.delete("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (post) res.json({ message: "Post deleted successfully" });
    else res.status(404).json({ message: "Post not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Http_server.listen(PORT, () => console.log(`Server running on port ${PORT}`));