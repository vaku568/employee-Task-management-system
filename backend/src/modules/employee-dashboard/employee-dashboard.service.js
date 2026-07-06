const Task =
  require("../../models/Task");

const Submission =
  require("../../models/Submission");

const Solution =
  require("../../models/Solution");

const getEmployeeDashboard =
  async (employeeId) => {

    const assignedTasks =
      await Task.countDocuments({
        assignedTo: employeeId
      });

    const submittedTasks =
      await Submission.countDocuments({
        employeeId
      });

    const reworkTasks =
      await Submission.countDocuments({
        employeeId,
        reviewStatus: "REWORK"
      });

    const approvedSolutions =
      await Solution.countDocuments({
        employeeId
      });

    const completedTasks =
      await Task.countDocuments({
        assignedTo: employeeId,
        status: "APPROVED"
      });

    return {
      assignedTasks,
      submittedTasks,
      reworkTasks,
      approvedSolutions,
      completedTasks
    };

  };

const getAssignedTasks =
  async (employeeId) => {

    return await Task.find({
      assignedTo: employeeId
    })
      .populate(
        "assignedBy",
        "name email"
      )
      .sort({
        createdAt: -1
      });

  };

/*
====================================
ACCEPT TASK
ASSIGNED -> PROGRESS
====================================
*/

const acceptTask =
  async (taskId) => {

    return await Task.findByIdAndUpdate(
      taskId,
      {
        status: "PROGRESS"
      },
      {
        new: true
      }
    );

  };

module.exports = {
  getEmployeeDashboard,
  getAssignedTasks,
  acceptTask
};