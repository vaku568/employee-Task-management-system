const Solution =
  require("../../models/Solution");

const Task =
  require("../../models/Task");

const User =
  require("../../models/User");

const notificationService = require("../notifications/notification.service");
const mongoose = require("mongoose");

/*
====================================
CREATE SOLUTION
====================================
*/

const createSolution =
  async (solutionData, employeeId) => {

    // Convert string ID to ObjectId if necessary
    const employeeObjectId = typeof employeeId === 'string' ? new mongoose.Types.ObjectId(employeeId) : employeeId;
    const taskObjectId = typeof solutionData.taskId === 'string' ? new mongoose.Types.ObjectId(solutionData.taskId) : solutionData.taskId;

    const solution =
      await Solution.create({
        ...solutionData,
        employeeId: employeeObjectId,
        taskId: taskObjectId,
        reviewStatus: "PENDING"
      });

    await Task.findByIdAndUpdate(
      taskObjectId,
      {
        status: "PENDING_REVIEW",
        submittedAt: new Date()
      },
      {
        new: true
      }
    );

    // Get task to find team lead
    const task = await Task.findById(taskObjectId);
    
    // Create notification for the team lead
    try {
      await notificationService.createNotification(
        employeeObjectId,
        task.assignedBy,
        "Solution Submitted",
        "An employee has submitted a solution for review.",
        "SOLUTION_SUBMITTED",
        solution._id
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    return solution;
  };

/*
====================================
ALL SOLUTIONS
====================================
*/

const getAllSolutions =
  async () => {

    return await Solution.find()
      .populate(
        "employeeId",
        "name email employeeId team"
      )
      .populate(
        "taskId",
        "studentName moduleCode status"
      )
      .sort({
        createdAt: -1
      });

  };

const getLatestSolutionByTaskId =
  async (taskId) => {

    return await Solution.findOne({
      taskId
    })
      .populate(
        "employeeId",
        "name email employeeId team"
      )
      .populate(
        "taskId",
        "studentName university moduleCode description status"
      )
      .sort({
        createdAt: -1
      });

  };

const getApprovedSolutions =
  async (filters) => {

    const query = {
      reviewStatus: "APPROVED"
    };

    if (filters.employee) {
      query["employeeId"] = filters.employee;
    }

    if (filters.solutionType) {
      query["solutionType"] = filters.solutionType;
    }

    if (filters.dateFrom || filters.dateTo) {
      query["reviewedAt"] = {};

      if (filters.dateFrom) {
        query["reviewedAt"]["$gte"] = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        query["reviewedAt"]["$lte"] = toDate;
      }
    }

    let solutions = await Solution.find(query)
      .populate(
        "employeeId",
        "name email employeeId team"
      )
      .populate(
        "taskId",
        "studentName university moduleCode uploadedFile uploadedFiles status"
      )
      .sort({
        reviewedAt: -1
      });

    if (filters.team) {
      solutions = solutions.filter(
        (solution) =>
          solution.employeeId?.team === filters.team
      );
    }

    return solutions;

  };

const getMyApprovedSolutions =
  async (employeeId) => {

    return await Solution.find({
      employeeId,
      reviewStatus: "APPROVED"
    })
      .populate(
        "taskId",
        "studentName university moduleCode uploadedFile uploadedFiles status"
      )
      .sort({
        reviewedAt: -1
      });

  };

/*
====================================
PENDING REVIEWS
====================================
*/

const getPendingReviews =
  async () => {

    return await Solution.find({
      reviewStatus: "PENDING"
    })
      .populate(
        "employeeId",
        "name email employeeId team"
      )
      .populate(
        "taskId",
        "studentName moduleCode status"
      )
      .sort({
        createdAt: -1
      });

  };

/*
====================================
APPROVE SOLUTION
====================================
*/

const approveSolution =
  async (solutionId) => {

    const solution =
      await Solution.findById(solutionId);

    if (!solution) {
      throw new Error(
        "Solution not found"
      );
    }

    solution.reviewStatus = "APPROVED";
    solution.reviewedAt = new Date();
    await solution.save();

    const task =
      await Task.findByIdAndUpdate(
        solution.taskId,
        {
          status: "APPROVED",
          reviewedAt: new Date()
        },
        {
          new: true
        }
      );

    if (!task) {
      throw new Error("Original task not found");
    }

    // Create notification for the employee
    try {
      await notificationService.createNotification(
        task.assignedBy,
        solution.employeeId,
        "Solution Approved",
        "Your solution has been approved.",
        "SOLUTION_APPROVED",
        solution._id
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    if (solution.solutionType === "PARAPHRASE") {
      const writingUser =
        await User.findOne({
          role: "EMPLOYEE",
          team: "WRITING"
        }).sort({ createdAt: 1 });

      const assignedTo =
        writingUser?._id || task.assignedTo;

      await Task.create({
        studentName: task.studentName,
        university: task.university,
        moduleCode: task.moduleCode,
        description: task.description,
        additionalNotes: task.additionalNotes,
        assignedBy: task.assignedBy,
        assignedTo,
        uploadedFile: task.uploadedFile,
        uploadedFiles: task.uploadedFiles || [],
        parentTaskId: task._id,
        status: "ASSIGNED",
        assignedAt: new Date()
      });
    }

    return solution;
  };

/*
====================================
REWORK SOLUTION
====================================
*/

const reworkSolution =
  async (solutionId) => {

    const solution =
      await Solution.findByIdAndUpdate(
        solutionId,
        {
          reviewStatus: "REWORK"
        },
        {
          new: true
        }
      );

    if (!solution) {
      throw new Error(
        "Solution not found"
      );
    }

    const task = await Task.findByIdAndUpdate(
      solution.taskId,
      {
        status: "REWORK",
        reviewedAt: new Date()
      },
      {
        new: true
      }
    );

    // Create notification for the employee
    try {
      await notificationService.createNotification(
        task.assignedBy,
        solution.employeeId,
        "Solution Rework Required",
        "Your solution requires rework. Please review and resubmit.",
        "SOLUTION_REWORK",
        solution._id
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    return solution;
  };

/*
====================================
MY SOLUTIONS
====================================
*/

const getMySolutions =
  async (employeeId) => {

    return await Solution.find({
      employeeId
    })
      .populate(
        "taskId",
        "studentName moduleCode status"
      )
      .sort({
        createdAt: -1
      });

  };


/*
====================================
SINGLE SOLUTION
====================================
*/

const getSolutionById =
  async (solutionId) => {

    return await Solution.findById(
      solutionId
    )
      .populate(
        "employeeId",
        "name email employeeId team"
      )
      .populate(
        "taskId",
        "studentName moduleCode status"
      );

  };

const getMyReworkSolutions = async (employeeId) => {
  return await Solution.find({
    employeeId,
    reviewStatus: "REWORK"
  })
    .populate("taskId")
    .sort({ reviewedAt: -1 });
};

const getMyHistory = async (employeeId) => {
  return await Solution.find({
    employeeId
  })
    .populate("taskId")
    .sort({ createdAt: -1 });
};

const getMyReviewedSolutions = async (employeeId) => {
  console.log("[DEBUG] getMyReviewedSolutions - Searching for employeeId:", employeeId);
  console.log("[DEBUG] getMyReviewedSolutions - Filter: reviewStatus = APPROVED");

  const solutions = await Solution.find({
    employeeId,
    reviewStatus: "APPROVED"
  })
    .populate("employeeId", "name email employeeId team")
    .populate("taskId", "studentName university moduleCode description status uploadedFile uploadedFiles")
    .sort({ reviewedAt: -1 });

  console.log("[DEBUG] getMyReviewedSolutions - Found solutions:", solutions.length);
  if (solutions.length > 0) {
    console.log("[DEBUG] getMyReviewedSolutions - First solution:", JSON.stringify(solutions[0], null, 2));
  }

  return solutions;
};

const getMyRepository = async (employeeId) => {
  console.log("[DEBUG] getMyRepository - Searching for employeeId:", employeeId);
  console.log("[DEBUG] getMyRepository - Filter: reviewStatus in [APPROVED, REWORK]");

  // First, try without reviewStatus filter to see if employeeId matches
  const allEmployeeSolutions = await Solution.find({
    employeeId
  });
  console.log("[DEBUG] getMyRepository - ALL solutions for this employee (no status filter):", allEmployeeSolutions.length);

  const solutions = await Solution.find({
    employeeId,
    reviewStatus: { $in: ["APPROVED", "REWORK"] }
  })
    .populate("employeeId", "name email employeeId team")
    .populate("taskId", "studentName university moduleCode description status uploadedFile uploadedFiles")
    .sort({ reviewedAt: -1 });

  console.log("[DEBUG] getMyRepository - Found solutions with APPROVED/REWORK:", solutions.length);
  if (solutions.length > 0) {
    console.log("[DEBUG] getMyRepository - First solution:", JSON.stringify(solutions[0], null, 2));
  } else if (allEmployeeSolutions.length > 0) {
    console.log("[DEBUG] getMyRepository - Employee has solutions but none with APPROVED/REWORK status");
    console.log("[DEBUG] getMyRepository - Sample solution statuses:", allEmployeeSolutions.map(s => s.reviewStatus));
  }

  return solutions;
};

const getReworkRepository = async () => {
  return await Solution.find({
    reviewStatus: "REWORK"
  })
    .populate(
      "employeeId",
      "name employeeId team"
    )
    .populate("taskId")
    .sort({ reviewedAt: -1 });
};

const getHistoryRepository = async () => {
  return await Solution.find()
    .populate(
      "employeeId",
      "name employeeId team"
    )
    .populate("taskId")
    .sort({ createdAt: -1 });
};

module.exports = {
  createSolution,
  getAllSolutions,
  getLatestSolutionByTaskId,
  getApprovedSolutions,
  getPendingReviews,
  approveSolution,
  reworkSolution,
  getMySolutions,
  getMyApprovedSolutions,
  getMyReworkSolutions,
  getMyHistory,
  getMyReviewedSolutions,
  getMyRepository,
  getReworkRepository,
  getHistoryRepository,
  getSolutionById
};