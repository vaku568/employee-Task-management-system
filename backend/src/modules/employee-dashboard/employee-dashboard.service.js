const Task =
  require("../../models/Task");

const Solution =
  require("../../models/Solution");

const EmployeeDailyReport =
  require("../../models/EmployeeDailyReport");

const getEmployeeDashboard =
  async (employeeId) => {

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Card 1: Total Assigned Tasks - All assigned tasks
    const totalAssignedTasks =
      await Task.countDocuments({
        assignedTo: employeeId
      }) || 0;

    // Card 2: Tasks In Progress - Tasks with status = PROGRESS
    const inProgressTasks =
      await Task.countDocuments({
        assignedTo: employeeId,
        status: "PROGRESS"
      }) || 0;

    // Card 3: Completed Tasks - Tasks with status = APPROVED
    const completedTasks =
      await Task.countDocuments({
        assignedTo: employeeId,
        status: "APPROVED"
      }) || 0;

    // Card 4: Pending Tasks - Tasks with status = ASSIGNED
    const pendingTasks =
      await Task.countDocuments({
        assignedTo: employeeId,
        status: "ASSIGNED"
      }) || 0;

    // Card 5: Rework Tasks - Tasks with status = REWORK
    const reworkTasks =
      await Task.countDocuments({
        assignedTo: employeeId,
        status: "REWORK"
      }) || 0;

    // Card 6: Approved Solutions - Solutions with reviewStatus = APPROVED
    const approvedSolutions =
      await Solution.countDocuments({
        employeeId,
        reviewStatus: "APPROVED"
      }) || 0;

    // Card 7: Total EOD Submitted
    const totalEODSubmitted =
      await EmployeeDailyReport.countDocuments({
        employeeId
      }) || 0;

    // Card 8: Work Count from EOD - Count individual tasks in all EODs
    const allEODs = await EmployeeDailyReport.find({ employeeId }) || [];
    let totalWorkCount = 0;
    allEODs.forEach(eod => {
      totalWorkCount += (eod.taskIds || []).length;
    });

    // Today's Work Count
    const todayEODs = await EmployeeDailyReport.find({
      employeeId,
      date: { $gte: today }
    }) || [];
    let todayWorkCount = 0;
    todayEODs.forEach(eod => {
      todayWorkCount += (eod.taskIds || []).length;
    });

    // Weekly Work Count
    const weeklyEODs = await EmployeeDailyReport.find({
      employeeId,
      date: { $gte: weekAgo }
    }) || [];
    let weeklyWorkCount = 0;
    weeklyEODs.forEach(eod => {
      weeklyWorkCount += (eod.taskIds || []).length;
    });

    // Monthly Work Count
    const monthlyEODs = await EmployeeDailyReport.find({
      employeeId,
      date: { $gte: monthAgo }
    }) || [];
    let monthlyWorkCount = 0;
    monthlyEODs.forEach(eod => {
      monthlyWorkCount += (eod.taskIds || []).length;
    });

    // Work Hours (assuming 1 task = 1 hour for simplicity - can be enhanced)
    const todayHours = todayWorkCount;
    const weeklyHours = weeklyWorkCount;
    const monthlyHours = monthlyWorkCount;

    // Chart data: Task Status Overview
    const assignedCount = await Task.countDocuments({
      assignedTo: employeeId,
      status: "ASSIGNED"
    }) || 0;

    const progressCount = await Task.countDocuments({
      assignedTo: employeeId,
      status: "PROGRESS"
    }) || 0;

    const approvedCount = await Task.countDocuments({
      assignedTo: employeeId,
      status: "APPROVED"
    }) || 0;

    const reworkCount = await Task.countDocuments({
      assignedTo: employeeId,
      status: "REWORK"
    }) || 0;

    // Work Type Distribution from EOD history
    const workTypeDistribution = {};
    allEODs.forEach(eod => {
      (eod.typesOfWork || []).forEach(type => {
        workTypeDistribution[type] = (workTypeDistribution[type] || 0) + 1;
      });
    });

    return {
      totalAssignedTasks,
      inProgressTasks,
      completedTasks,
      pendingTasks,
      reworkTasks,
      approvedSolutions,
      totalEODSubmitted,
      totalWorkCount,
      todayWorkCount,
      weeklyWorkCount,
      monthlyWorkCount,
      todayHours,
      weeklyHours,
      monthlyHours,
      // Chart data
      taskStatus: {
        assigned: assignedCount,
        progress: progressCount,
        approved: approvedCount,
        rework: reworkCount
      },
      workTypeDistribution
    };

  };

const getRecentAssignedTasks =
  async (employeeId) => {

    const tasks = await Task.find({
      assignedTo: employeeId
    })
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    return tasks || [];

  };

const getRecentCompletedWorks =
  async (employeeId) => {

    const works = await Solution.find({
      employeeId,
      reviewStatus: "APPROVED"
    })
      .populate("taskId", "studentName moduleCode")
      .sort({ reviewedAt: -1 })
      .limit(5);

    return works || [];

  };

const getRecentActivity =
  async (employeeId) => {

    const activities = [];

    // Get recent tasks
    const tasks = await Task.find({
      assignedTo: employeeId
    })
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    if (tasks) {
      tasks.forEach(task => {
        activities.push({
          type: "Task Assigned",
          title: `Task assigned by ${task.assignedBy?.name || "Team Lead"}`,
          date: task.createdAt,
          icon: "Assignment"
        });
      });
    }

    // Get recent solutions
    const solutions = await Solution.find({
      employeeId
    })
      .sort({ createdAt: -1 })
      .limit(5);

    if (solutions) {
      solutions.forEach(solution => {
        if (solution.reviewStatus === "APPROVED") {
          activities.push({
            type: "Solution Approved",
            title: `Your ${solution.solutionType} solution was approved`,
            date: solution.reviewedAt || solution.createdAt,
            icon: "CheckCircle"
          });
        } else if (solution.reviewStatus === "REWORK") {
          activities.push({
            type: "Solution Rework",
            title: `Your solution was sent for rework`,
            date: solution.reviewedAt || solution.createdAt,
            icon: "Refresh"
          });
        } else {
          activities.push({
            type: "Solution Submitted",
            title: `You submitted a ${solution.solutionType} solution`,
            date: solution.submittedAt,
            icon: "Send"
          });
        }
      });
    }

    // Sort by date and return latest 10
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

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
  getRecentAssignedTasks,
  getRecentCompletedWorks,
  getRecentActivity,
  getAssignedTasks,
  acceptTask
};