const logger = require("../config/logger");

// Error types for classification
const ErrorTypes = {
  VALIDATION_ERROR: "ValidationError",
  AUTHENTICATION_ERROR: "AuthenticationError",
  AUTHORIZATION_ERROR: "AuthorizationError",
  NOT_FOUND_ERROR: "NotFoundError",
  DATABASE_ERROR: "DatabaseError",
  RATE_LIMIT_ERROR: "RateLimitError",
  FILE_UPLOAD_ERROR: "FileUploadError",
  INTERNAL_ERROR: "InternalError",
};

// Custom error class
class AppError extends Error {
  constructor(
    message,
    statusCode,
    type = ErrorTypes.INTERNAL_ERROR,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error classification helper
const classifyError = (err) => {
  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return {
      type: ErrorTypes.VALIDATION_ERROR,
      statusCode: 400,
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join(", "),
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return {
      type: ErrorTypes.VALIDATION_ERROR,
      statusCode: 400,
      message: `${field} already exists`,
    };
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    return {
      type: ErrorTypes.VALIDATION_ERROR,
      statusCode: 400,
      message: "Invalid ID format",
    };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return {
      type: ErrorTypes.AUTHENTICATION_ERROR,
      statusCode: 401,
      message: "Invalid token",
    };
  }

  if (err.name === "TokenExpiredError") {
    return {
      type: ErrorTypes.AUTHENTICATION_ERROR,
      statusCode: 401,
      message: "Token expired",
    };
  }

  // Joi validation errors
  if (err.isJoi) {
    return {
      type: ErrorTypes.VALIDATION_ERROR,
      statusCode: 400,
      message: err.details.map((detail) => detail.message).join(", "),
    };
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return {
      type: ErrorTypes.FILE_UPLOAD_ERROR,
      statusCode: 400,
      message: "File too large",
    };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return {
      type: ErrorTypes.FILE_UPLOAD_ERROR,
      statusCode: 400,
      message: "Unexpected file field",
    };
  }

  // Rate limiting errors
  if (err.type === "entity.too.large") {
    return {
      type: ErrorTypes.VALIDATION_ERROR,
      statusCode: 413,
      message: "Request entity too large",
    };
  }

  // Default classification
  return {
    type: ErrorTypes.INTERNAL_ERROR,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal server error",
  };
};

// Main error handler middleware
const errorHandler = (err, req, res, next) => {
  const { type, statusCode, message } = classifyError(err);

  // Log the error with context
  const errorContext = {
    type,
    statusCode,
    message,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: req.user?.id,
    userRole: req.user?.role,
    body: req.body,
    params: req.params,
    query: req.query,
  };

  // Log based on severity
  if (statusCode >= 500) {
    logger.logError(err, errorContext);
  } else if (statusCode >= 400) {
    logger.warn("Client error", errorContext);
  }

  // Security logging for authentication/authorization errors
  if (
    type === ErrorTypes.AUTHENTICATION_ERROR ||
    type === ErrorTypes.AUTHORIZATION_ERROR
  ) {
    logger.logSecurity("auth_error", {
      type,
      message,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
    });
  }

  // Prepare response
  const response = {
    success: false,
    error: {
      type,
      message,
      timestamp: new Date().toISOString(),
    },
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.error.stack = err.stack;
  }

  // Add request ID if available
  if (req.requestId) {
    response.error.requestId = req.requestId;
  }

  res.status(statusCode).json(response);
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    ErrorTypes.NOT_FOUND_ERROR
  );

  logger.warn("Route not found", {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  ErrorTypes,
};
