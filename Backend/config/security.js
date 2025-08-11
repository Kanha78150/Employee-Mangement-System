/**
 * Security Configuration
 * Centralized security settings for the application
 */

const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256'
  },

  // Password Configuration
  password: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },

  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
  },

  // File Upload Configuration
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES 
      ? process.env.ALLOWED_FILE_TYPES.split(',')
      : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    uploadPath: 'uploads/'
  },

  // Admin Configuration
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@company.com',
    password: process.env.ADMIN_PASSWORD || 'SecureAdmin123!',
    name: process.env.ADMIN_NAME || 'System Administrator'
  },

  // Security Headers
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }
};

/**
 * Validate security configuration
 */
function validateSecurityConfig() {
  const errors = [];

  // Validate JWT Secret
  if (!securityConfig.jwt.secret) {
    errors.push('JWT_SECRET is required');
  } else if (securityConfig.jwt.secret.length < 32) {
    errors.push('JWT_SECRET should be at least 32 characters long');
  }

  // Validate Admin credentials
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn('⚠️ ADMIN_EMAIL and ADMIN_PASSWORD should be set in environment variables');
  }

  if (errors.length > 0) {
    throw new Error(`Security configuration errors: ${errors.join(', ')}`);
  }

  return true;
}

module.exports = {
  securityConfig,
  validateSecurityConfig
};
