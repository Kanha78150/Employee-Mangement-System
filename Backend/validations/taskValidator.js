const Joi = require("joi");

const timeField = Joi.string()
  .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  .custom((value, helpers) => {
    const [hourStr] = value.split(":");
    const hour = parseInt(hourStr, 10);
    if (hour < 9 || hour > 21) {
      return helpers.message("Time must be between 09:00 and 21:00");
    }
    return value;
  })
  .required();

exports.assignTaskSchema = Joi.object({
  employeeId: Joi.string().required(),
  title: Joi.string().max(200).required(),
  description: Joi.string().max(2000).required(),
  reMarks: Joi.string().max(2000).optional(),
  startTime: timeField.label("Start Time"),
  endTime: timeField.label("End Time"),
  taskDate: Joi.date().iso().required(),
  organization: Joi.string().max(5000).required(),
  priority: Joi.string().valid("Low", "Medium", "High").default("Medium"),
  completion: Joi.number().min(0).max(100).default(0),
});

exports.updateTaskSchema = Joi.object({
  title: Joi.string().max(200).optional(),
  description: Joi.string().max(2000).optional(),
  reMarks: Joi.string().max(2000).optional(),
  taskDate: Joi.date().iso().optional(),
  organization: Joi.string().max(5000).optional(),
  priority: Joi.string().valid("Low", "Medium", "High").optional(),
  completion: Joi.number().min(0).max(100).optional(),
});
