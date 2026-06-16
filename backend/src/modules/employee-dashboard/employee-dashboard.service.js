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

module.exports = {
  getEmployeeDashboard
};