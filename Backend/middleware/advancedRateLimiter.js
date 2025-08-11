const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const Redis = require("redis");
const logger = require("../config/logger");

// Redis client for distributed rate limiting (optional)
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = Redis.createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.on('error', (err) => {
    logger.error('Redis Client Error', err);
  });
}

// Advanced rate limiter with user-based and IP-based limits
const createAdvancedLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxPerIP = 1000, // Max requests per IP
    maxPerUser = 200, // Max requests per authenticated user
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = null,
  } = options;

  return rateLimit({
    windowMs,
    max: maxPerIP,
    
    // Use Redis store if available for distributed systems
    store: redisClient ? new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }) : undefined,

    // Custom key generator for user-based limiting
    keyGenerator: keyGenerator || ((req) => {
      // For authenticated users, use user ID + IP combination
      if (req.user && req.user.id) {
        return `user:${req.user.id}:${req.ip}`;
      }
      // For unauthenticated requests, use IP only
      return req.ip;
    }),

    // Dynamic limit based on user authentication
    max: (req) => {
      if (req.user && req.user.id) {
        return maxPerUser; // Lower limit for authenticated users
      }
      return maxPerIP; // Higher limit for IP-based limiting
    },

    skipSuccessfulRequests,
    skipFailedRequests,

    message: {
      success: false,
      error: {
        type: 'RateLimitError',
        message: 'Too many requests. Please try again later.',
        timestamp: new Date().toISOString(),
      },
    },

    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
      const isAuthenticated = req.user && req.user.id;
      const limitType = isAuthenticated ? 'user' : 'ip';
      const identifier = isAuthenticated ? req.user.id : req.ip;

      logger.logSecurity('advanced_rate_limit_exceeded', {
        limitType,
        identifier,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.url,
        method: req.method,
        userId: req.user?.id,
        userRole: req.user?.role,
        maxLimit: isAuthenticated ? maxPerUser : maxPerIP,
      });

      res.status(429).json({
        success: false,
        error: {
          type: 'RateLimitError',
          message: `Too many requests from ${limitType}. Please try again later.`,
          timestamp: new Date().toISOString(),
          retryAfter: Math.ceil(windowMs / 1000),
          limitType,
        },
      });
    },
  });
};

// Enterprise-grade rate limiters for 1000+ users
const enterpriseGeneralLimiter = createAdvancedLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxPerIP: 2000, // High limit for shared IPs (corporate networks)
  maxPerUser: 500, // Per-user limit
});

const enterpriseAuthLimiter = createAdvancedLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxPerIP: 100, // Auth attempts per IP
  maxPerUser: 10, // Auth attempts per user
  skipSuccessfulRequests: true, // Only count failed attempts
});

const enterpriseUploadLimiter = createAdvancedLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxPerIP: 200, // Uploads per IP
  maxPerUser: 20, // Uploads per user
});

// Burst protection for sudden traffic spikes
const burstProtectionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Very short burst limit
  message: {
    success: false,
    error: {
      type: 'BurstProtectionError',
      message: 'Too many requests in a short time. Please slow down.',
      timestamp: new Date().toISOString(),
    },
  },
  handler: (req, res) => {
    logger.logSecurity('burst_protection_triggered', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      userId: req.user?.id,
    });

    res.status(429).json({
      success: false,
      error: {
        type: 'BurstProtectionError',
        message: 'Too many requests in a short time. Please slow down.',
        timestamp: new Date().toISOString(),
        retryAfter: 60,
      },
    });
  },
});

module.exports = {
  createAdvancedLimiter,
  enterpriseGeneralLimiter,
  enterpriseAuthLimiter,
  enterpriseUploadLimiter,
  burstProtectionLimiter,
};
