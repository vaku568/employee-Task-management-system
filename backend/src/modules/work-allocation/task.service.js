const Task = require("../../models/Task");
const notificationService = require("../notifications/notification.service");
const mongoose = require("mongoose");

const createTask = async (taskData, teamLeadId) => {
  console.log("[DEBUG] task.service.createTask", { taskData, teamLeadId });

  // Convert string ID to ObjectId if necessary
  const teamLeadObjectId = typeof teamLeadId === 'string' ? new mongoose.Types.ObjectId(teamLeadId) : teamLeadId;
  const assignedToObject = typeof taskData.assignedTo === 'string' ? new mongoose.Types.ObjectId(taskData.assignedTo) : taskData.assignedTo;

  const task = await Task.create({
    ...taskData,
    assignedBy: teamLeadObjectId,
    assignedTo: assignedToObject,
    status: "ASSIGNED"
  });

  console.log("[DEBUG] task.service.createTask created", task._id);

  // Create notification for the assigned employee
  try {
    await notificationService.createNotification(
      teamLeadObjectId,
      assignedToObject,
      "New Assignment",
      "You have been assigned a new task.",
      "TASK_ASSIGNED",
      task._id
    );
  } catch (notificationError) {
    console.error("Error creating notification:", notificationError);
    // Don't fail the task creation if notification fails
  }

  return task;
};

const getAllTasks = async () => {
  const tasks = await Task.find()
    .populate("assignedTo", "name email employeeId team")
    .populate("assignedBy", "name email");

  return tasks;
};

module.exports = {
  createTask,
  getAllTasks
};