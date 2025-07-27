const authService = require("../services/authService");

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authService.loginAdmin(email, password);
    res.json({ token });
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
