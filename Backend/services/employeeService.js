const Employee = require("../models/Employee");
const AuditLog = require("../models/AuditLog");
const { sendEmail } = require("../utils/sendMail");

const generateEmployeeId = async () => {
  // Format: EMP+XX+NUMBER (e.g., EMP+AB+1234)
  const randomLetters = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return (
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)]
    );
  };
  let unique = false;
  let employeeId = "";
  while (!unique) {
    const letters = randomLetters();
    const number = Math.floor(1000 + Math.random() * 9000); // 4 digits
    employeeId = `EMP${letters}${number}`;
    const exists = await Employee.findOne({ employeeId });
    if (!exists) unique = true;
  }
  return employeeId;
};

exports.createEmployee = async (adminId, data) => {
  // Remove employeeId from input if present
  if (data.employeeId) delete data.employeeId;
  data.employeeId = await generateEmployeeId();

  const employee = await Employee.create(data);
  await AuditLog.create({
    user: adminId,
    action: `Created employee ${data.employeeId}`,
  });
  await sendEmail(
    employee.email,
    "Welcome to Employee Dashboard",
    `Hello ${employee.name}, you are registered as ${employee.role}. Your Employee ID is ${employee.employeeId}.`
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

exports.updateProfile = async (id, updateData) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from response

    return employee;
  } catch (error) {
    throw error;
  }
};

exports.deleteEmployee = async (adminId, empId) => {
  // Change from findByIdAndUpdate to findByIdAndDelete
  const deletedEmployee = await Employee.findByIdAndUpdate(
    empId,
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!deletedEmployee) {
    throw new Error("Employee not found");
  }

  await AuditLog.create({
    user: adminId,
    action: `Permanently deleted employee ${deletedEmployee.employeeId}`,
  });

  return { message: "Employee permanently deleted" };
};
