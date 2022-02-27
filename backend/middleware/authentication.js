const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    var token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "some_very_long_secret");
    req.userData = { email: decodedToken.email, userId: decodedToken.id };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "You are not authenticated!",
    });
  }
};
