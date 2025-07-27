const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

exports.loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new Error("Invalid Credentials");
  }
  return generateToken(admin);
};

exports.loginEmployee = async (employeeId, password) => {
  const employee = await Employee.findOne({ employeeId, isDeleted: false });
  if (!employee || !(await employee.verifyPassword(password))) {
    throw new Error("Invalid Credentials");
  }
  return generateToken(employee);
};
