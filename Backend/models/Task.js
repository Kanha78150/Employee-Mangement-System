const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Task description is required"],
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  taskDate: {
    type: Date,
    required: [true, "Task date is required"],
  },
  taskTime: {
    type: String,
    required: [true, "Task time is required"],
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please enter valid time format (HH:MM)",
    ],
  },
  organization: {
    type: String,
    required: [true, "Organization details are required"],
    trim: true,
    maxlength: [5000, "Organization details cannot exceed 5000 characters"],
  },
  attachment: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
