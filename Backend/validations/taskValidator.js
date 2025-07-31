const Joi = require("joi");

exports.assignTaskSchema = Joi.object({
  employeeId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  taskDate: Joi.date().iso().required(),
  taskTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  organization: Joi.string().max(1000).required(),
  attachment: Joi.string().optional(), // <-- Add this
});

exports.updateTaskSchema = Joi.object({
  status: Joi.string().valid("Pending", "Ongoing", "Completed").required(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  taskDate: Joi.date().iso().optional(),
  taskTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  organization: Joi.string().max(1000).optional(),
  attachment: Joi.string().optional(),
});
