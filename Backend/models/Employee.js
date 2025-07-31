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

  // Add these new fields to the employeeSchema
  date_of_birth: {
    type: Date,
    required: [true, "Date of birth is required"],
    validate: {
      validator: function (value) {
        return value < new Date();
      },
      message: "Date of birth must be in the past",
    },
  },
  date_of_joining: {
    type: Date,
    required: [true, "Date of joining is required"],
    default: Date.now,
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Other"],
    trim: true,
  },
});

// Add this middleware for handling password updates
employeeSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    try {
      update.password = await bcrypt.hash(update.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Keep existing password hashing for new documents
employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

employeeSchema.methods.verifyPassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model("Employee", employeeSchema);
