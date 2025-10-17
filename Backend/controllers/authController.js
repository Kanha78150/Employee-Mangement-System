const authService = require("../services/authService");

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.loginAdmin(email, password);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || "Login failed. Please check your credentials.",
    });
  }
};

exports.employeeLogin = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and password are required",
      });
    }

    const token = await authService.loginEmployee(employeeId, password);
    res.json({
      success: true,
      message: "Login successful!",
      token,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || "Login failed. Please check your credentials.",
    });
  }
};

// ✅ New: Change admin password
exports.changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    await authService.changeAdminPassword(
      adminId,
      currentPassword,
      newPassword
    );
    res.json({
      success: true,
      message:
        "Password changed successfully! Please login with your new password.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to change password. Please try again.",
    });
  }
};
