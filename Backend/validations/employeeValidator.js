const Joi = require("joi");

exports.createEmployeeSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  department: Joi.string()
    .valid("Technical", "Non-technical", "Support", "HR")
    .required(),
  role: Joi.string().required(),
  image: Joi.string().uri().optional(),
  date_of_birth: Joi.date().iso().required(),
  date_of_joining: Joi.date().iso().required(),
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .insensitive()
    .required(),
  // New fields
  contactNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,20}$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid contact number",
      "any.required": "Contact number is required",
    }),
  designation: Joi.string().min(2).max(100).required().messages({
    "string.min": "Designation must be at least 2 characters",
    "string.max": "Designation cannot exceed 100 characters",
    "any.required": "Designation is required",
  }),
  location: Joi.string().min(2).max(200).required().messages({
    "string.min": "Location must be at least 2 characters",
    "string.max": "Location cannot exceed 200 characters",
    "any.required": "Location is required",
  }),
});

exports.updateEmployeeSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional().allow(""),
  department: Joi.string()
    .valid("Technical", "Non-technical", "Support", "HR")
    .optional(),
  role: Joi.string().optional(),
  image: Joi.any().optional(),
  date_of_birth: Joi.date().iso().optional(),
  date_of_joining: Joi.date().iso().optional(),
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .insensitive()
    .optional(),
  // New fields for update
  contactNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,20}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please enter a valid contact number",
    }),
  designation: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Designation must be at least 2 characters",
    "string.max": "Designation cannot exceed 100 characters",
  }),
  location: Joi.string().min(2).max(200).optional().messages({
    "string.min": "Location must be at least 2 characters",
    "string.max": "Location cannot exceed 200 characters",
  }),
});
