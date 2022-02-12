const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://test:xqN36objiUctwObC@cluster0.2frdf.mongodb.net/mean-course?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connection Succeeded!");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.post("/api/posts", (req, res, next) => {
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

app.use("/api/posts", (req, res, next) => {
  Post.find().then((documents) => {
    res
      .status(200)
      .json({ message: "Request processed successfully", posts: documents });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(201).json({ message: "Post Deleted!" });
    })
    .catch(() => {
      console.log("An error occurred while delete!");
    });
});

module.exports = app;
