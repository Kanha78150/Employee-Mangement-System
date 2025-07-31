const employeeService = require("../services/employeeService");
const bcrypt = require("bcrypt");

exports.createEmployee = async (req, res, next) => {
  try {
    console.log("Received data:", req.body);
    console.log("Files:", req.file);

    const employeeData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    };

    console.log("Processing employee data:", employeeData);

    const employee = await employeeService.createEmployee(
      req.user.id,
      employeeData
    );
    res.status(201).json(employee);
  } catch (err) {
    console.error("Create employee error:", err);
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
    const { id } = req.params;
    const updateData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    };

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const employee = await employeeService.updateProfile(id, updateData);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if employee exists before deletion
    const employee = await employeeService.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const result = await employeeService.deleteEmployee(req.user.id, id);
    res.json(result);
  } catch (err) {
    console.error("Delete error:", err);
    next(err);
  }
};
