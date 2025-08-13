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

  // Personal Information
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

  // New Fields
  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    trim: true,
    validate: {
      validator: function (value) {
        // Allow various phone number formats
        return /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ""));
      },
      message: "Please enter a valid contact number",
    },
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    trim: true,
    maxlength: [100, "Designation cannot exceed 100 characters"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
    maxlength: [200, "Location cannot exceed 200 characters"],
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
