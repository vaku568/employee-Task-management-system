const User =
  require("../../models/User");

const Task =
  require("../../models/Task");

const Submission =
  require("../../models/Submission");

const Solution =
  require("../../models/Solution");

const getTeamLeadDashboard =
  async () => {

    const totalEmployees =
      await User.countDocuments({
        role: "EMPLOYEE"
      });

    const totalTasks =
      await Task.countDocuments();

    const pendingReviews =
      await Submission.countDocuments({
        reviewStatus: "PENDING"
      });

    const approvedTasks =
      await Task.countDocuments({
        status: "APPROVED"
      });

    const reworkTasks =
      await Task.countDocuments({
        status: "REWORK"
      });

    const solutionsCount =
      await Solution.countDocuments();

    return {
      totalEmployees,
      totalTasks,
      pendingReviews,
      approvedTasks,
      reworkTasks,
      solutionsCount
    };
  };

module.exports = {
  getTeamLeadDashboard
};