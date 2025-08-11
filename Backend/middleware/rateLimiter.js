const rateLimit = require("express-rate-limit");
const logger = require("../config/logger");

// General rate limiter - Scalable for 1000+ users
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // Increased for large user base
  message: {
    success: false,
    error: {
      type: "RateLimitError",
      message: "Too many requests from this IP, please try again later.",
      timestamp: new Date().toISOString(),
    },
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.logSecurity("rate_limit_exceeded", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
      method: req.method,
      userId: req.user?.id,
      userRole: req.user?.role,
    });

    res.status(429).json({
      success: false,
      error: {
        type: "RateLimitError",
        message: "Too many requests from this IP, please try again later.",
        timestamp: new Date().toISOString(),
        retryAfter:
          Math.round(parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000) || 900,
      },
    });
  },
  skip: (req) => {
    // Skip rate limiting for certain routes in development
    if (process.env.NODE_ENV === "development") {
      return req.url === "/health" || req.url.startsWith("/uploads");
    }
    return false;
  },
});

// Authentication rate limiter - Increased for large user base
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 20, // Increased for multiple users per IP
  message: {
    success: false,
    error: {
      type: "RateLimitError",
      message: "Too many authentication attempts, please try again later.",
      timestamp: new Date().toISOString(),
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.logSecurity("auth_rate_limit_exceeded", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
      method: req.method,
      email: req.body?.email,
      employeeId: req.body?.employeeId,
    });

    res.status(429).json({
      success: false,
      error: {
        type: "RateLimitError",
        message: "Too many authentication attempts, please try again later.",
        timestamp: new Date().toISOString(),
        retryAfter: 900, // 15 minutes
      },
    });
  },
});

// File upload rate limiter - Increased for large user base
const uploadLimiter = rateLimit({
  windowMs: parseInt(process.env.UPLOAD_RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 minute
  max: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX) || 50, // Increased for multiple users per IP
  message: {
    success: false,
    error: {
      type: "RateLimitError",
      message: "Too many file uploads, please try again later.",
      timestamp: new Date().toISOString(),
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.logSecurity("upload_rate_limit_exceeded", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
      method: req.method,
      userId: req.user?.id,
      userRole: req.user?.role,
    });

    res.status(429).json({
      success: false,
      error: {
        type: "RateLimitError",
        message: "Too many file uploads, please try again later.",
        timestamp: new Date().toISOString(),
        retryAfter: 60,
      },
    });
  },
});

// Password change rate limiter - Increased for large user base
const passwordChangeLimiter = rateLimit({
  windowMs: parseInt(process.env.PASSWORD_CHANGE_WINDOW_MS) || 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.PASSWORD_CHANGE_LIMIT_MAX) || 10, // Increased for multiple users per IP
  message: {
    success: false,
    error: {
      type: "RateLimitError",
      message: "Too many password change attempts, please try again later.",
      timestamp: new Date().toISOString(),
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.logSecurity("password_change_rate_limit_exceeded", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
      method: req.method,
      userId: req.user?.id,
      userRole: req.user?.role,
    });

    res.status(429).json({
      success: false,
      error: {
        type: "RateLimitError",
        message: "Too many password change attempts, please try again later.",
        timestamp: new Date().toISOString(),
        retryAfter: 3600, // 1 hour
      },
    });
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  passwordChangeLimiter,
};
