const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["Pending", "Ongoing", "Completed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Task", taskSchema);
