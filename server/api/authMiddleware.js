const jwt = require("jsonwebtoken");

let checkToken = role => {
  return (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).json({
        message: "Access token missing",
        success: false
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || role.indexOf(decoded.role) === -1) {
        return res.status(403).json({
          message: "Invalid Access Token",
          success: false
        });
      }
      req.user = decoded;
      next();
    });
  };
};

module.exports = checkToken;
