const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { json } = require("body-parser");

const router = express.Router();

router.post("/signup/", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed!",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed!",
        });
      }
      let jwt = jsonwebtoken.sign(
        { email: fetchedUser.email, id: fetchedUser._id },
        "some_very_long_secret",
        {
          expiresIn: "1h",
        }
      );
      return res
        .status(201)
        .json({ token: jwt, expiresIn: 3600, userId: fetchedUser._id });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth Failed!",
      });
    });
});

module.exports = router;
