const { validationResult } = require("express-validator");

const taskService = require("./task.service");

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const taskData = {
      ...req.body,
      uploadedFile: req.file
        ? req.file.path
        : ""
    };

    const task = await taskService.createTask(
      taskData,
      req.user.id
    );

    res.status(201).json(task);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks =
      await taskService.getAllTasks();

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createTask,
  getAllTasks
};