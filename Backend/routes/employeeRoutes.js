const router = require("express").Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateProfile,
  deleteEmployee,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");
const permit = require("../middleware/roleMiddleware");
const validateBody = require("../middleware/validateBody");
const upload = require("../middleware/uploadMiddleware");
const {
  createEmployeeSchema,
  updateEmployeeSchema,
} = require("../validations/employeeValidator");

router.post(
  "/",
  protect,
  permit("admin"),
  upload.single("image"),
  validateBody(createEmployeeSchema),
  createEmployee
);
router.get("/", protect, permit("admin"), getEmployees);
router.get("/:id", protect, permit("admin", "employee"), getEmployeeById);
router.put(
  "/:id",
  protect,
  permit("admin"),
  upload.single("image"),
  validateBody(updateEmployeeSchema),
  updateProfile
);

router.delete("/:id", protect, permit("admin"), deleteEmployee);

module.exports = router;
