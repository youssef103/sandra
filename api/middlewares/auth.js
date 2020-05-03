const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token frm Header
  const token = req.header("x-auth-token");

  // check if not Token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.userID = decoded.userID;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid." });
  }
};
