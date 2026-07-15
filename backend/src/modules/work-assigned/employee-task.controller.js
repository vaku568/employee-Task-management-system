const employeeTaskService =
  require("./employee-task.service");

const getMyTasks = async (req, res) => {
  try {

    const tasks =
      await employeeTaskService.getMyTasks(
        req.user.id
      );

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const downloadTask = async (req, res) => {
  try {

    const task =
      await employeeTaskService.downloadTask(
        req.params.taskId,
        req.user.id
      );

    res.download(
      task.uploadedFile
    );

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }
};

const acceptTask = async (req, res) => {
  try {
    console.log("[DEBUG] acceptTask controller - Request received:", {
      taskId: req.params.taskId,
      userId: req.user.id
    });

    const task = await employeeTaskService.acceptTask(
      req.params.taskId,
      req.user.id
    );

    console.log("[DEBUG] acceptTask controller - Task returned from service:", {
      taskId: task._id,
      status: task.status,
      acceptedAt: task.acceptedAt
    });

    res.status(200).json(task);

  } catch (error) {
    console.error("[ERROR] acceptTask controller:", error);
    res.status(400).json({
      message: error.message
    });

  }
};

module.exports = {
  getMyTasks,
  downloadTask,
  acceptTask
};