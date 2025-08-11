const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const logger = require("../config/logger");

exports.loginAdmin = async (email, password) => {
  try {
    logger.info("Admin login attempt", { email, action: "login_attempt" });

    const admin = await Admin.findOne({ email });
    if (!admin) {
      logger.logAuth("admin_login", email, false, { reason: "user_not_found" });
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      logger.logAuth("admin_login", email, false, {
        reason: "invalid_password",
      });
      throw new Error("Invalid Credentials");
    }

    // ✅ Check if this is first login (password hasn't been changed)
    const isFirstLogin = admin.isFirstLogin !== false; // Default to true if not set

    // ✅ Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin);

    logger.logAuth("admin_login", email, true, {
      isFirstLogin,
      adminId: admin._id,
      lastLogin: admin.lastLogin,
    });

    return {
      token,
      isFirstLogin,
      message: isFirstLogin
        ? "Please change your password after first login"
        : "Login successful",
    };
  } catch (error) {
    logger.error("Admin login error:", {
      email,
      error: error.message,
      action: "login_failed",
    });
    throw error;
  }
};

exports.loginEmployee = async (employeeId, password) => {
  try {
    logger.info("Employee login attempt", {
      employeeId,
      action: "employee_login_attempt",
    });

    const employee = await Employee.findOne({ employeeId, isDeleted: false });
    if (!employee) {
      logger.logAuth("employee_login", employeeId, false, {
        reason: "employee_not_found",
      });
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await employee.verifyPassword(password);
    if (!isPasswordValid) {
      logger.logAuth("employee_login", employeeId, false, {
        reason: "invalid_password",
      });
      throw new Error("Invalid Credentials");
    }

    logger.logAuth("employee_login", employeeId, true, {
      employeeId: employee._id,
      email: employee.email,
      department: employee.department,
    });

    return { token: generateToken(employee) };
  } catch (error) {
    logger.error("Employee login error:", {
      employeeId,
      error: error.message,
      action: "employee_login_failed",
    });
    throw error;
  }
};

// ✅ New: Change admin password
exports.changeAdminPassword = async (adminId, currentPassword, newPassword) => {
  try {
    logger.info("Admin password change attempt", {
      adminId,
      action: "password_change_attempt",
    });

    const admin = await Admin.findById(adminId);
    if (!admin) {
      logger.warn("Password change failed - admin not found", {
        adminId,
        action: "password_change_failed",
      });
      throw new Error("Admin not found");
    }

    // ✅ Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isCurrentPasswordValid) {
      logger.logSecurity("password_change_invalid_current", {
        adminId,
        email: admin.email,
        action: "password_change_failed",
      });
      throw new Error("Current password is incorrect");
    }

    // ✅ Validate new password strength
    if (newPassword.length < 8) {
      logger.warn("Password change failed - weak password", {
        adminId,
        email: admin.email,
        action: "password_change_failed",
      });
      throw new Error("New password must be at least 8 characters long");
    }

    // ✅ Set new password (will be hashed by pre-save middleware)
    admin.password = newPassword;
    admin.isFirstLogin = false; // Mark as no longer first login
    admin.passwordChangedAt = new Date();

    await admin.save();

    logger.info("Admin password changed successfully", {
      adminId,
      email: admin.email,
      isFirstLogin: false,
      passwordChangedAt: admin.passwordChangedAt,
      action: "password_changed",
    });

    return { message: "Password changed successfully" };
  } catch (error) {
    logger.error("Change admin password error:", {
      adminId,
      error: error.message,
      stack: error.stack,
      action: "password_change_error",
    });
    throw error;
  }
};
