const Task = require("../models/Task");
const Employee = require("../models/Employee");
const AuditLog = require("../models/AuditLog");
const { sendEmail } = require("../utils/sendMail");

exports.assignTask = async (adminId, data) => {
  const {
    employeeId,
    title,
    description,
    reMarks,
    startTime,
    endTime,
    taskDate,
    organization,
    priority,
    completion,
  } = data;
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new Error("Invalid employee");

  const task = await Task.create({
    employee: employeeId,
    title,
    description,
    reMarks,
    startTime,
    endTime,
    taskDate,
    organization,
    priority,
    completion,
  });
  await AuditLog.create({
    user: adminId,
    action: `Assigned task "${title}" to ${employeeId}`,
  });
  await sendEmail(
    employee.email,
    "New Task Assigned",
    `You have a new task: ${title}`
  );

  return task;
};

// Admin or Employee can view tasks of any employee
exports.getEmployeeTasks = async (reqUser, targetId) => {
  if (reqUser.role === "employee" && reqUser.id !== targetId) {
    throw new Error("Not authorized for these tasks");
  }
  return Task.find({ employee: targetId });
};

// Employee view their own tasks
exports.getMyTasks = async (userId) => {
  return Task.find({ employee: userId });
};

// Employee updates task status
exports.updateTaskStatus = async (reqUser, taskId, completion) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  if (reqUser.role === "employee" && String(task.employee) !== reqUser.id) {
    throw new Error("Not authorized for this task");
  }

  const previousCompletion = task.completion;
  task.completion = completion;

  // Always update the last updated time and user for any progress change
  task.lastUpdatedTime = new Date();
  task.lastUpdatedBy = reqUser.id;

  // Set submission time when task is completed (100%)
  if (completion === 100 && previousCompletion < 100) {
    task.submissionTime = new Date();
  }
  // Clear submission time if task is moved back from completed state
  else if (completion < 100 && previousCompletion === 100) {
    task.submissionTime = null;
  }

  await task.save();

  await AuditLog.create({
    user: reqUser.id,
    action: `Updated task ${taskId} status from ${previousCompletion}% to ${completion}%${
      completion === 100 ? " (Completed)" : ""
    }`,
  });

  return task;
};

// Admin – get all tasks
exports.getAllTasks = async () => {
  return Task.find()
    .populate("employee", "name employeeId")
    .populate("lastUpdatedBy", "name employeeId");
};
