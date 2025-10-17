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
    res.status(201).json({
      success: true,
      message: `Employee ${employee.name} created successfully! Employee ID: ${employee.employeeId}`,
      data: employee,
    });
  } catch (err) {
    console.error("Create employee error:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create employee. Please try again.",
    });
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const result = await employeeService.getEmployees(req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees. Please try again.",
    });
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role === "employee" && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have permission to view this employee's information",
      });
    }
    const employee = await employeeService.getEmployeeById(id);
    if (!employee)
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    res.json({
      success: true,
      data: employee,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee details. Please try again.",
    });
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
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    res.json({
      success: true,
      message: `Employee ${employee.name} updated successfully!`,
      data: employee,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update employee. Please try again.",
    });
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if employee exists before deletion
    const employee = await employeeService.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const result = await employeeService.deleteEmployee(req.user.id, id);
    res.json({
      success: true,
      message: `Employee ${employee.name} has been deleted successfully!`,
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to delete employee. Please try again.",
    });
  }
};
