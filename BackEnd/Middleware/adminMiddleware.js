const jwt = require("jsonwebtoken");
const User = require("../Model/UserModel");

const adminAuth = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "failure",
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret_key"
      );
    } catch (err) {
      const unverified = jwt.decode(token);
      if (unverified && (unverified.iss?.includes("google") || unverified.email)) {
        const user = await User.findOne({ email: unverified.email });
        if (user) {
          decoded = {
            id: user._id.toString(),
            _id: user._id.toString(),
            email: user.email,
            role: user.role
          };
        } else {
          return res.status(403).json({
            status: "failure",
            message: "Access denied. Admin user not found.",
          });
        }
      } else {
        throw err;
      }
    }

    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "failure",
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      status: "failure",
      message: "Token is invalid or expired",
    });
  }
};

module.exports = adminAuth;