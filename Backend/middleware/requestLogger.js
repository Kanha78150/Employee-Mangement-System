const morgan = require("morgan");
const logger = require("../config/logger");
const crypto = require("crypto");

// Generate unique request ID
const generateRequestId = (req, res, next) => {
  req.requestId = crypto.randomUUID();
  res.setHeader("X-Request-ID", req.requestId);
  next();
};

// Custom Morgan token for request ID
morgan.token("id", (req) => req.requestId);

// Custom Morgan token for user info
morgan.token("user", (req) => {
  if (req.user) {
    return `${req.user.id}:${req.user.role}`;
  }
  return "anonymous";
});

// Custom Morgan token for response time in ms
morgan.token("response-time-ms", (req, res) => {
  if (!req._startAt || !res._startAt) {
    return "";
  }

  const ms =
    (res._startAt[0] - req._startAt[0]) * 1000 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;
  return ms.toFixed(3);
});

// Custom format for detailed logging
const detailedFormat =
  ':id :remote-addr :user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time-ms ms';

// Custom format for simple logging
const simpleFormat = ":method :url :status :response-time ms";

// Create Morgan middleware with Winston stream
const requestLogger = morgan(
  process.env.NODE_ENV === "production" ? detailedFormat : simpleFormat,
  {
    stream: logger.stream,
    skip: (req, res) => {
      // Skip logging for health checks and static files
      return (
        req.url === "/health" ||
        req.url.startsWith("/uploads") ||
        req.url.endsWith(".ico")
      );
    },
  }
);

// Enhanced request logger with additional context
const enhancedRequestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request start
  logger.debug("Request started", {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    contentType: req.get("Content-Type"),
    contentLength: req.get("Content-Length"),
    userId: req.user?.id,
    userRole: req.user?.role,
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const responseTime = Date.now() - startTime;

    // Log response
    logger.logRequest(req, res, responseTime);

    // Log response details in debug mode
    if (process.env.LOG_LEVEL === "debug") {
      logger.debug("Request completed", {
        requestId: req.requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        contentLength: res.get("Content-Length"),
        userId: req.user?.id,
        userRole: req.user?.role,
      });
    }

    // Call original end
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Security event logger
const logSecurityEvent = (event, req, details = {}) => {
  logger.logSecurity(event, {
    requestId: req.requestId,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    userRole: req.user?.role,
    ...details,
  });
};

// Rate limit logger
const logRateLimit = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    if (res.statusCode === 429) {
      logSecurityEvent("rate_limit_exceeded", req, {
        message: "Rate limit exceeded",
        statusCode: res.statusCode,
      });
    }

    originalSend.call(this, data);
  };

  next();
};

module.exports = {
  generateRequestId,
  requestLogger,
  enhancedRequestLogger,
  logSecurityEvent,
  logRateLimit,
};
