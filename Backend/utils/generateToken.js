const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  // ✅ Use environment variable for token expiration
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

  return jwt.sign(
    {
      id: user._id,
      role: user.accountRole || user.role || "employee",
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn,
    }
  );
};

module.exports = generateToken;
