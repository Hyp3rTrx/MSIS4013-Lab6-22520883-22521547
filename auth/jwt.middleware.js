const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const parts = authHeader.split(" ");
  const token = parts.length > 1 ? parts[1] : parts[0];
  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = payload;
    req.token = token;
    next();
  });
}

module.exports = { authenticateToken };
