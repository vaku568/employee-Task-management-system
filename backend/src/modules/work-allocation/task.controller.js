const { validationResult } = require("express-validator");

const taskService = require("./task.service");

const createTask = async (req, res) => {
  console.log("[DEBUG] createTask called", {
    body: req.body,
    file: req.file ? req.file.originalname : null,
    filePath: req.file ? req.file.path : null,
    user: req.user && req.user.id
  });

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("[DEBUG] createTask validation failed", errors.array());
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

    console.log("[DEBUG] createTask success", task._id);
    res.status(201).json(task);

  } catch (error) {
    console.error("[ERROR] createTask", error);
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

const Task =
  require("../../models/Task");

const path =
  require("path");

const downloadTaskFile =
  async (req, res) => {

    try {

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {

        return res.status(404).json({
          message: "Task not found"
        });

      }

      res.download(
        path.resolve(
          task.uploadedFile
        )
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }



    
  };

module.exports = {
  createTask,
  getAllTasks,
  downloadTaskFile
};
