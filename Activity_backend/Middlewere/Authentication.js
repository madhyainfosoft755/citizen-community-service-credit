// middleware/auth.js
const { logger } = require("../utils/util");

const extractToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const token = authHeader.split(" ")[1]; // Assuming the format is "Bearer <token>"
      if (token) {
        console.log("in side extract token if token exist ");
        req.token = token;
        next();
      } else {
        res.status(401).json({ error: "Token not provided" });
      }
    } else {
      res.status(401).json({ error: "Authorization header not found" });
    }
  } catch (error) {
    res.status(401).json({ error: "Something Went Wrong" });
    logger.error(error);
  }
};

module.exports = extractToken;
