const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
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
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      validate: {
        validator: function (v) {
          const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!regex.test(v)) return false;
          const [hour] = v.split(":").map(Number);
          return hour >= 9 && hour <= 21;
        },
        message: "Start time must be between 09:00 and 21:00 in HH:MM format",
      },
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      validate: {
        validator: function (v) {
          const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!regex.test(v)) return false;
          const [hour] = v.split(":").map(Number);
          return hour >= 9 && hour <= 21;
        },
        message: "End time must be between 09:00 and 21:00 in HH:MM format",
      },
    },
    taskDate: {
      type: Date,
      required: [true, "Task date is required"],
      validate: {
        validator: function (v) {
          return v instanceof Date && !isNaN(v);
        },
        message: "Task date must be a valid date",
      },
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
    completion: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      required: true,
    },
    submissionTime: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          // Allow null or valid date
          return v === null || (v instanceof Date && !isNaN(v));
        },
        message: "Submission time must be a valid date",
      },
    },
    lastUpdatedTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Task", taskSchema);
