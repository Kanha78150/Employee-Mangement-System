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
  reMarks: {
    type: String,
    trim: true,
    maxlength: [2000, "Remarks cannot exceed 1000 characters"],
  },
  taskDate: {
    type: Date,
    required: [true, "Task date is required"],
  },
  organization: {
    type: String,
    required: [true, "Organization details are required"],
    trim: true,
    maxlength: [5000, "Organization details cannot exceed 5000 characters"],
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
    required: [true, "Task priority is required"],
  },
});

module.exports = mongoose.model("Task", taskSchema);
