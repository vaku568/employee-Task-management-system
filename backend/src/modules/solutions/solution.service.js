const Solution =
  require("../../models/Solution");

const Task =
  require("../../models/Task");

const User =
  require("../../models/User");

/*
====================================
CREATE SOLUTION
====================================
*/

const createSolution =
  async (solutionData, employeeId) => {

    const solution =
      await Solution.create({
        ...solutionData,
        employeeId,
        reviewStatus: "PENDING"
      });

    const taskStatus =
      solutionData.solutionType === "FINAL"
        ? "FINAL"
        : "PARAPHRASE";

    await Task.findByIdAndUpdate(
      solutionData.taskId,
      {
        status: taskStatus,
        submittedAt: new Date()
      },
      {
        new: true
      }
    );

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

    await Task.findByIdAndUpdate(
      solution.taskId,
      {
        status: "REWORK",
        reviewedAt: new Date()
      }
    );

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
  getReworkRepository,
  getHistoryRepository,
  getSolutionById
};