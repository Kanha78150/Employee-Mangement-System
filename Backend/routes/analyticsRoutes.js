const router = require("express").Router();
const { getStats } = require("../controllers/analyticController");
const protect = require("../middleware/authMiddleware");
const permit = require("../middleware/roleMiddleware");

router.get("/", protect, permit("admin"), getStats);

module.exports = router;
