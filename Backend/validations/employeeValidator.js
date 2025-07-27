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
});

exports.updateEmployeeSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  image: Joi.string().uri().optional(),
});
