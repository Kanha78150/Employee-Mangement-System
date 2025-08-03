const router = require("express").Router();
const {
  assignTask,
  getEmployeeTasks,
  getMyTasks,
  updateTaskStatus,
  getAllTasks,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const permit = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validateBody = require("../middleware/validateBody");
const {
  assignTaskSchema,
  updateTaskSchema,
} = require("../validations/taskValidator");

// Admin assigns task
router.post(
  "/assign",
  protect,
  permit("admin"),
  validateBody(assignTaskSchema),
  assignTask
);

// Admin: Get all tasks (for analytics)
router.get("/", protect, permit("admin"), getAllTasks);

// Admin view specific employee tasks
router.get(
  "/employee/:id",
  protect,
  permit("admin", "employee"),
  getEmployeeTasks
);

// Employee-only: view their own tasks
router.get("/my", protect, permit("employee"), getMyTasks);

// Employee updates own task status
router.patch(
  "/:id",
  protect,
  permit("employee"),
  validateBody(updateTaskSchema),
  updateTaskStatus
);

module.exports = router;
