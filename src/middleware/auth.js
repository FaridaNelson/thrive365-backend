const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  // Robust parsing: supports extra spaces
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res
      .status(401)
      .json({ message: "Invalid Authorization format. Use: Bearer <token>" });
  }

  const token = match[1].trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { auth };
