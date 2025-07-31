const Joi = require("joi");

exports.createEmployeeSchema = Joi.object({
  name: Joi.string().required(),
  employeeId: Joi.string().required(),
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
});
