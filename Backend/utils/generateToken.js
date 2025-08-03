const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.accountRole || "employee" },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

module.exports = generateToken;
