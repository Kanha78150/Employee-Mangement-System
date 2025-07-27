const Employee = require("../models/Employee");
const Task = require("../models/Task");

exports.getStats = async () => {
  const totalEmployees = await Employee.countDocuments({ isDeleted: false });
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: "Completed" });
  const ongoingTasks = await Task.countDocuments({ status: "Ongoing" });

  return { totalEmployees, totalTasks, completedTasks, ongoingTasks };
};
