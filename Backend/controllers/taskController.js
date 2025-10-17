const taskService = require("../services/taskService");

exports.assignTask = async (req, res, next) => {
  try {
    const taskData = {
      ...req.body,
    };
    const task = await taskService.assignTask(req.user.id, taskData);
    res.status(201).json({
      success: true,
      message: `Task "${task.title}" assigned successfully!`,
      data: task,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to assign task. Please try again.",
    });
  }
};

exports.getEmployeeTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getEmployeeTasks(req.user, req.params.id);
    res.json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err.message || "You don't have permission to view these tasks.",
    });
  }
};

// New: Employee-only route for their own tasks
exports.getMyTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getMyTasks(req.user.id);
    res.json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your tasks. Please try again.",
    });
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateTaskStatus(
      req.user,
      req.params.id,
      req.body.completion
    );

    let message = "Task status updated successfully!";
    if (req.body.completion === 100) {
      message = "Congratulations! Task marked as completed!";
    } else if (req.body.completion === 0) {
      message = "Task status reset to pending.";
    }

    res.json({
      success: true,
      message,
      data: task,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update task status. Please try again.",
    });
  }
};

// NEW: Admin – get all tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks. Please try again.",
    });
  }
};
