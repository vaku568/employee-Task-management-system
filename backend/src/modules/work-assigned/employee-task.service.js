const Task = require("../../models/Task");
const notificationService = require("../notifications/notification.service");
const mongoose = require("mongoose");

const getMyTasks = async (employeeId) => {
  // Convert string ID to ObjectId if necessary
  const employeeObjectId = typeof employeeId === 'string' ? new mongoose.Types.ObjectId(employeeId) : employeeId;
  
  const tasks = await Task.find({
    assignedTo: employeeObjectId
  })
    .populate("assignedBy", "name email");

  return tasks;
};

const downloadTask = async (taskId, employeeId) => {
  // Convert string IDs to ObjectId if necessary
  const taskObjectId = typeof taskId === 'string' ? new mongoose.Types.ObjectId(taskId) : taskId;
  const employeeObjectId = typeof employeeId === 'string' ? new mongoose.Types.ObjectId(employeeId) : employeeId;
  
  const task = await Task.findOne({
    _id: taskObjectId,
    assignedTo: employeeObjectId
  });

  if (!task) {
    throw new Error("Task not found");
  }

  task.status = "PROGRESS";
  task.downloadedAt = new Date();

  await task.save();

  return task;
};

const acceptTask = async (taskId, employeeId) => {
  console.log("[DEBUG] acceptTask service - Finding task:", { taskId, employeeId });

  // Convert string IDs to ObjectId if necessary
  const taskObjectId = typeof taskId === 'string' ? new mongoose.Types.ObjectId(taskId) : taskId;
  const employeeObjectId = typeof employeeId === 'string' ? new mongoose.Types.ObjectId(employeeId) : employeeId;

  const task = await Task.findOne({
    _id: taskObjectId,
    assignedTo: employeeObjectId
  });

  if (!task) {
    console.log("[ERROR] acceptTask service - Task not found");
    throw new Error("Task not found");
  }

  console.log("[DEBUG] acceptTask service - Task found:", {
    taskId: task._id,
    currentStatus: task.status,
    assignedTo: task.assignedTo
  });

  if (task.status !== "ASSIGNED") {
    console.log("[ERROR] acceptTask service - Task status is not ASSIGNED:", task.status);
    throw new Error("Task can only be accepted when status is ASSIGNED");
  }

  task.status = "PROGRESS";
  task.acceptedAt = new Date();

  console.log("[DEBUG] acceptTask service - Saving task with new status:", {
    taskId: task._id,
    newStatus: task.status,
    acceptedAt: task.acceptedAt
  });

  await task.save();

  console.log("[DEBUG] acceptTask service - Task saved successfully:", {
    taskId: task._id,
    status: task.status,
    acceptedAt: task.acceptedAt
  });

  // Create notification for the team lead
  try {
    await notificationService.createNotification(
      employeeObjectId,
      task.assignedBy,
      "Task Accepted",
      "An employee has accepted a task.",
      "TASK_ACCEPTED",
      task._id
    );
  } catch (notificationError) {
    console.error("Error creating notification:", notificationError);
  }

  return task;
};

module.exports = {
  getMyTasks,
  downloadTask,
  acceptTask
};