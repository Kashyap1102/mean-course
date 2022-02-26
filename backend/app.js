const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/posts");
const userRoutes = require("./routes/user");
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.use("/api/posts", routes);
app.use("/api/user", userRoutes);

module.exports = app;
