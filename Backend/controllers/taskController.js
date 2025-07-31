const taskService = require("../services/taskService");

exports.assignTask = async (req, res, next) => {
  try {
    const taskData = {
      ...req.body,
      attachment: req.file ? `/uploads/${req.file.filename}` : undefined,
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
      req.body.status
    );
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.uploadAttachment = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ file: req.file.filename, url: `/uploads/${req.file.filename}` });
};
