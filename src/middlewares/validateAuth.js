const jwt = require("jsonwebtoken");

const validateAuth = {
  isAuthenticated(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (verifiedToken) {
        next();
      }
    } catch (errror) {
      res.status(401).json({
        message: "Access token invalid",
      });
    }
  },

  isAdmin(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const role = verifiedToken.role;
    if (role === "admin") {
      next();
    } else {
      res.status(401).json({
        message: "Access denied!",
      });
    }
  },
};

module.exports = validateAuth;
