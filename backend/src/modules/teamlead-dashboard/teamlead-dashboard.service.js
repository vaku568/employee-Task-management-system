const User =
  require("../../models/User");

const Task =
  require("../../models/Task");

const Solution =
  require("../../models/Solution");

const mongoose = require("mongoose");

const getTeamLeadDashboard =
  async (teamLeadId) => {

    // Convert string ID to ObjectId if necessary
    const teamLeadObjectId = typeof teamLeadId === 'string' ? new mongoose.Types.ObjectId(teamLeadId) : teamLeadId;

    const totalEmployees =
      await User.countDocuments({
        role: "EMPLOYEE"
      }) || 0;

    const totalTasks =
      await Task.countDocuments({
        assignedBy: teamLeadObjectId
      }) || 0;

    const tasksInProgress =
      await Task.countDocuments({
        assignedBy: teamLeadObjectId,
        status: "PROGRESS"
      }) || 0;

    // Get all task IDs assigned by this Team Lead
    const teamLeadTasks = await Task.find({
      assignedBy: teamLeadObjectId
    }).select("_id");
    
    const teamLeadTaskIds = teamLeadTasks.map(task => task._id);

    // Filter solutions by tasks assigned by this Team Lead
    const approvedSolutions =
      await Solution.countDocuments({
        taskId: { $in: teamLeadTaskIds },
        reviewStatus: "APPROVED"
      }) || 0;

    const reworkSolutions =
      await Solution.countDocuments({
        taskId: { $in: teamLeadTaskIds },
        reviewStatus: "REWORK"
      }) || 0;

    const pendingReviews =
      await Solution.countDocuments({
        taskId: { $in: teamLeadTaskIds },
        reviewStatus: "PENDING"
      }) || 0;

    return {
      totalEmployees,
      totalTasks,
      pendingReviews: tasksInProgress,
      approvedTasks: approvedSolutions,
      reworkTasks: reworkSolutions,
      solutionsCount: pendingReviews
    };

  };

module.exports = {
  getTeamLeadDashboard
};