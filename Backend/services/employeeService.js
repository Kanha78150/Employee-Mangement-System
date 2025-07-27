const Employee = require("../models/Employee");
const AuditLog = require("../models/AuditLog");
const { sendEmail } = require("../utils/sendMail");

exports.createEmployee = async (adminId, data) => {
  const exists = await Employee.findOne({ employeeId: data.employeeId });
  if (exists) throw new Error("Employee ID already exists");

  const employee = await Employee.create(data);
  await AuditLog.create({
    user: adminId,
    action: `Created employee ${data.employeeId}`,
  });
  await sendEmail(
    employee.email,
    "Welcome to Employee Dashboard",
    `Hello ${employee.name}, you are registered as ${employee.role}.`
  );

  return employee;
};

exports.getEmployees = async (queryParams) => {
  const { page = 1, limit = 10, search = "" } = queryParams;
  const query = {
    isDeleted: false,
    $or: [
      { name: new RegExp(search, "i") },
      { employeeId: new RegExp(search, "i") },
      { role: new RegExp(search, "i") },
      { department: new RegExp(search, "i") },
    ],
  };

  const employees = await Employee.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Employee.countDocuments(query);

  return {
    employees,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

exports.getEmployeeById = async (id) => {
  return Employee.findById(id);
};

exports.updateProfile = async (userId, data) => {
  const allowedFields = ["name", "email", "image"];
  const update = {};
  allowedFields.forEach((key) => {
    if (data[key]) update[key] = data[key];
  });
  return Employee.findByIdAndUpdate(userId, update, { new: true });
};

exports.deleteEmployee = async (adminId, empId) => {
  await Employee.findByIdAndUpdate(empId, { isDeleted: true });
  await AuditLog.create({
    user: adminId,
    action: `Archived employee ${empId}`,
  });
  return { message: "Employee archived" };
};
