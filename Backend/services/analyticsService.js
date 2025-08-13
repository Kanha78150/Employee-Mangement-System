const Employee = require("../models/Employee");
const Task = require("../models/Task");

exports.getStats = async () => {
  const totalEmployees = await Employee.countDocuments({ isDeleted: false });
  const totalTasks = await Task.countDocuments();

  // Calculate task completion statistics
  const completedTasks = await Task.countDocuments({ completion: 100 });
  const pendingTasks = await Task.countDocuments({ completion: 0 });
  const inProgressTasks = await Task.countDocuments({
    completion: { $gt: 0, $lt: 100 },
  });

  // Calculate average completion rate
  const allTasks = await Task.find({}, "completion");
  const averageCompletion =
    allTasks.length > 0
      ? Math.round(
          allTasks.reduce((sum, task) => sum + (task.completion || 0), 0) /
            allTasks.length
        )
      : 0;

  return {
    totalEmployees,
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    averageCompletion,
  };
};
