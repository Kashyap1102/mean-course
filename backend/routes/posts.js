const Post = require("../models/post");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authentication = require("../middleware/authentication");

const MIME_TYPE_MAP = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Ivalid MIME type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  authentication,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    console.log(req.userData);
    post
      .save()
      .then((createdPost) => {
        console.log(createdPost);
        res.status(201).json({
          message: "Post created successfully!",
          post: { ...createdPost, id: createdPost._id },
        });
      })
      .catch((err) =>
        res.status(500).json({
          message: err.message,
        })
      );
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      console.log(fetchedPosts);

      res.status(200).json({
        message: "Request processed successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((err) =>
      res.status(500).json({
        message: err.message,
      })
    );
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: err.message,
      })
    );
});

router.delete("/:id", authentication, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post Deleted!" });
      } else {
        res.status(401).json({ message: "Authorization Failed!!" });
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: err.message,
      })
    );
});

router.put(
  "/:id",
  authentication,
  multer({ storage: storage }).single("imagePath"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post();
    post._id = req.params.id;
    post.title = req.body.title;
    post.content = req.body.content;
    post.imagePath = imagePath;

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then((result) => {
        console.log(result);
        if (result.modifiedCount > 0) {
          res.status(200).json({ message: "Post updated!" });
        } else {
          res.status(401).json({ message: "Authorization Failed!!" });
        }
      })
      .catch((err) =>
        res.status(500).json({
          message: err.message,
        })
      );
  }
);

module.exports = router;
