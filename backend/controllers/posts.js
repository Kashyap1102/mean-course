const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
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
};

exports.getPosts = (req, res, next) => {
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
};

exports.getPost = (req, res, next) => {
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
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
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
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  console.log(imagePath);
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
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Post updated!" });
      } else {
        res.status(401).json({ message: "Authorization Failed!!" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};
