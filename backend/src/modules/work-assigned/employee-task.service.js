const Task = require("../../models/Task");

const getMyTasks = async (employeeId) => {

  const tasks = await Task.find({
    assignedTo: employeeId
  })
    .populate(
      "assignedBy",
      "name email"
    );

  return tasks;
};

const downloadTask = async (
  taskId,
  employeeId
) => {

  const task = await Task.findOne({
    _id: taskId,
    assignedTo: employeeId
  });

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  task.status = "PROGRESS";

  task.downloadedAt = new Date();

  await task.save();

  return task;
};

module.exports = {
  getMyTasks,
  downloadTask
};