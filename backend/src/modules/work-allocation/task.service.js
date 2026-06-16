const Task = require("../../models/Task");

const createTask = async (taskData, teamLeadId) => {

  const task = await Task.create({
    ...taskData,
    assignedBy: teamLeadId,
    status: "ASSIGNED"
  });

  return task;
};

const getAllTasks = async () => {

  const tasks = await Task.find()
    .populate(
      "assignedTo",
      "name email employeeId team"
    )
    .populate(
      "assignedBy",
      "name email"
    );

  return tasks;
};

module.exports = {
  createTask,
  getAllTasks
};