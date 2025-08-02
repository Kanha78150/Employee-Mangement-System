const taskService = require("../services/taskService");

exports.assignTask = async (req, res, next) => {
  try {
    const taskData = {
      ...req.body,
    };
    const task = await taskService.assignTask(req.user.id, taskData);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.getEmployeeTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getEmployeeTasks(req.user, req.params.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// New: Employee-only route for their own tasks
exports.getMyTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getMyTasks(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateTaskStatus(
      req.user,
      req.params.id,
      req.body.completion
    );
    res.json(task);
  } catch (err) {
    next(err);
  }
};
