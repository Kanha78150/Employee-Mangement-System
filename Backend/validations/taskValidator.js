const Joi = require("joi");

exports.assignTaskSchema = Joi.object({
  employeeId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
});

exports.updateTaskSchema = Joi.object({
  status: Joi.string().valid("Pending", "Ongoing", "Completed").required(),
});
