const jwt = require('jwt-simple');
// middleware/checkAdmin.js
module.exports = function checkAdmin(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
  if (decoded?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
