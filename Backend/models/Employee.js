const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  password: String,
  department: String,
  role: { type: String, default: "employee" },
  image: String,
  isDeleted: { type: Boolean, default: false },

  // ✅ NEW FIELD to store employee's latest task status
  latestTaskStatus: {
    type: String,
    enum: ["No Task", "Pending", "Ongoing", "Completed"],
    default: "No Task",
  },
});

employeeSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

employeeSchema.methods.verifyPassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model("Employee", employeeSchema);
