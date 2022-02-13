const Post = require("../models/post");
const express = require('express');
const router = express.Router();



router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    res
      .status(201)
      .json({ message: "Post created successfully!", postId: createdPost._id });
  });
});

router.get("", (req, res, next) => {
  console.log("get executed!");
  Post.find().then((documents) => {
    res
      .status(200)
      .json({ message: "Request processed successfully", posts: documents });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post();
  post._id = req.params.id;
  post.title = req.body.title;
  post.content = req.body.content;
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: "Post updated!" });
  });
});

module.exports = router;
