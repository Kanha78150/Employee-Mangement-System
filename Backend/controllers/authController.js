const authService = require("../services/authService");

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginAdmin(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.employeeLogin = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;
    const token = await authService.loginEmployee(employeeId, password);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// ✅ New: Change admin password
exports.changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.id;

    await authService.changeAdminPassword(
      adminId,
      currentPassword,
      newPassword
    );
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};
