const multer = require("multer");
const path = require("path");

// ✅ Environment-based file upload configuration
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // 5MB default
const ALLOWED_FILE_TYPES = process.env.ALLOWED_FILE_TYPES
  ? process.env.ALLOWED_FILE_TYPES.split(",")
  : ["image/jpeg", "image/png", "image/gif", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    // ✅ Add timestamp and sanitize filename
    const sanitizedBase = base.replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${Date.now()}_${sanitizedBase}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // ✅ Use environment-based file type validation
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Only these file types are allowed: ${ALLOWED_FILE_TYPES.join(", ")}`
      ),
      false
    );
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
