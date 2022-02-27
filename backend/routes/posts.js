const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const extractFile = require("../middleware/extractFile");
const PostController = require("../controllers/posts");

router.post("", authentication, extractFile, PostController.createPost);
router.get("", PostController.getPosts);
router.get("/:id", PostController.getPost);
router.delete("/:id", authentication, PostController.deletePost);
router.put("/:id", authentication, extractFile, PostController.updatePost);

module.exports = router;
