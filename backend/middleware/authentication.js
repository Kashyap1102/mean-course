const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    var token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "some_very_long_secret");
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed!",
    });
  }
};
