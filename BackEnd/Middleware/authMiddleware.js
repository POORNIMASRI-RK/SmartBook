const jwt = require('jsonwebtoken');
const User = require('../Model/UserModel');

const UserAuth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "failure",
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.user = decoded;
    return next();
  } catch (err) {
    // If local JWT verification fails, check if token is a Google OAuth ID Token
    try {
      const decoded = jwt.decode(token);
      if (decoded && (decoded.iss?.includes("google") || decoded.email)) {
        let user = await User.findOne({ email: decoded.email });
        if (!user) {
          user = await User.create({
            name: decoded.name || decoded.email.split("@")[0],
            email: decoded.email,
            password: "google_oauth_authenticated_user",
            role: "user"
          });
        }
        req.user = {
          id: user._id.toString(),
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        };
        return next();
      }
    } catch (googleErr) {
      console.error("Google Token Verification Error:", googleErr);
    }

    return res.status(401).json({
      status: "failure",
      message: "Token is invalid or expired",
    });
  }
};

module.exports = UserAuth;