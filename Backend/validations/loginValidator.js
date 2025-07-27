const Joi = require("joi");

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.employeeLoginSchema = Joi.object({
  employeeId: Joi.string().required(),
  password: Joi.string().required(),
});
