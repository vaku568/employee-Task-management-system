const User =
  require("../../models/User");

const Task =
  require("../../models/Task");

const Submission =
  require("../../models/Submission");

const Solution =
  require("../../models/Solution");

const getSummaryReport =
  async () => {

    const totalEmployees =
      await User.countDocuments({
        role: "EMPLOYEE"
      });

    const totalTasks =
      await Task.countDocuments();

    const totalSubmissions =
      await Submission.countDocuments();

    const totalSolutions =
      await Solution.countDocuments();

    const approvedTasks =
      await Task.countDocuments({
        status: "APPROVED"
      });

    const reworkTasks =
      await Task.countDocuments({
        status: "REWORK"
      });

    return {
      totalEmployees,
      totalTasks,
      totalSubmissions,
      totalSolutions,
      approvedTasks,
      reworkTasks
    };
  };

module.exports = {
  getSummaryReport
};