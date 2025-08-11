const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/errorMiddleware");
const {
  generateRequestId,
  requestLogger,
  enhancedRequestLogger,
} = require("./middleware/requestLogger");
const { generalLimiter } = require("./middleware/rateLimiter");
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");
const path = require("path");
const analyticsRoutes = require("./routes/analyticsRoutes");

// ✅ Load environment variables
dotenv.config();

// ✅ Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error("Missing required environment variables", {
    missingVars: missingEnvVars,
    message:
      "Please check your .env file and ensure all required variables are set.",
  });
  process.exit(1);
}

// ✅ Validate JWT Secret strength
if (process.env.JWT_SECRET.length < 32) {
  logger.warn("JWT_SECRET should be at least 32 characters long for security", {
    currentLength: process.env.JWT_SECRET.length,
    recommendedLength: 32,
  });
}

const app = express();

// ✅ Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "http://localhost:5000",
          "http://localhost:5173",
        ],
        connectSrc: [
          "'self'",
          "http://localhost:5000",
          "http://localhost:5173",
        ],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ✅ Request tracking and logging
app.use(generateRequestId);
app.use(requestLogger);
app.use(enhancedRequestLogger);

// ✅ Rate limiting
app.use(generalLimiter);

// ✅ CORS Configuration - Environment-based
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect DB
connectDB().then(() => createDefaultAdmin()); // ✅ Ensure default admin

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/analytics", analyticsRoutes);

// ✅ Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// ✅ Start server with proper logging
const server = app.listen(PORT, HOST, () => {
  logger.info(`✅ Server running on ${HOST}:${PORT}`, {
    port: PORT,
    host: HOST,
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
  });
});

// ✅ Graceful shutdown handling
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

// ✅ Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

// ✅ Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

/**
 * ✅ Create default admin if not exists - Using Environment Variables
 */
async function createDefaultAdmin() {
  try {
    // ✅ Use environment variables for admin credentials
    const email = process.env.ADMIN_EMAIL || "admin@company.com";
    const password = process.env.ADMIN_PASSWORD || "SecureAdmin123!";
    const name = process.env.ADMIN_NAME || "System Administrator";

    // ✅ Validate required environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      logger.warn(
        "⚠️ ADMIN_EMAIL and ADMIN_PASSWORD should be set in environment variables"
      );
    }

    const existing = await Admin.findOne({ email });
    if (!existing) {
      await Admin.create({
        email,
        password,
        name: name,
      });

      logger.info(`✅ Default Admin created: ${email}`, {
        email,
        name,
        action: "admin_created",
      });

      logger.warn(
        "⚠️ Please change the default admin password after first login",
        { email, action: "security_warning" }
      );
    } else {
      logger.info("ℹ️ Default admin already exists.", {
        email,
        action: "admin_exists",
      });
    }
  } catch (err) {
    logger.error("❌ Error creating default admin:", {
      error: err.message,
      stack: err.stack,
      action: "admin_creation_failed",
    });
  }
}
