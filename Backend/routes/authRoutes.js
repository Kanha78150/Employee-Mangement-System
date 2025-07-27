const router = require("express").Router();
const { adminLogin, employeeLogin } = require("../controllers/authController");
const validateBody = require("../middleware/validateBody");
const {
  loginSchema,
  employeeLoginSchema,
} = require("../validations/loginValidator");

router.post("/admin", validateBody(loginSchema), adminLogin);
router.post("/employee", validateBody(employeeLoginSchema), employeeLogin);

module.exports = router;
