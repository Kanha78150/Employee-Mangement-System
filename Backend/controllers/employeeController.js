const employeeService = require("../services/employeeService");

exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(
      req.user.id,
      req.body
    );
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const result = await employeeService.getEmployees(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role === "employee" && req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const employee = await employeeService.getEmployeeById(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const employee = await employeeService.updateProfile(req.user.id, req.body);
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const result = await employeeService.deleteEmployee(
      req.user.id,
      req.params.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
