const router = require("express").Router();
const {
  adminLogin,
  employeeLogin,
  changeAdminPassword,
} = require("../controllers/authController");
const validateBody = require("../middleware/validateBody");
const protect = require("../middleware/authMiddleware");
const {
  authLimiter,
  passwordChangeLimiter,
} = require("../middleware/rateLimiter");
const {
  loginSchema,
  employeeLoginSchema,
  changePasswordSchema,
} = require("../validations/loginValidator");

// ✅ Authentication routes with rate limiting
router.post("/admin", authLimiter, validateBody(loginSchema), adminLogin);
router.post(
  "/employee",
  authLimiter,
  validateBody(employeeLoginSchema),
  employeeLogin
);

// ✅ Change admin password route (protected with rate limiting)
router.put(
  "/admin/change-password",
  passwordChangeLimiter,
  protect,
  validateBody(changePasswordSchema),
  changeAdminPassword
);

module.exports = router;
