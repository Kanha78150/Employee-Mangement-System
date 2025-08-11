const Joi = require("joi");

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.employeeLoginSchema = Joi.object({
  employeeId: Joi.string().required(),
  password: Joi.string().required(),
});

// ✅ New: Change password validation schema
exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.pattern.base":
        "New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "string.min": "New password must be at least 8 characters long",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
    }),
});
