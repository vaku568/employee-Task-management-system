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

module.exports = {
  getMyTasks,
  downloadTask
};