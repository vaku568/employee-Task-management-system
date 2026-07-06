const { validationResult } =
  require("express-validator");

const solutionService =
  require("./solution.service");

/*
====================================
SUBMIT SOLUTION
====================================
*/

const submitSolution =
  async (req, res) => {
    console.log("[DEBUG] submitSolution called", {
      body: req.body,
      files: req.files ? req.files.map(f => f.originalname) : [],
      user: req.user && req.user.id
    });

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log("[DEBUG] submitSolution validation failed", errors.array());
        return res.status(400).json({
          errors: errors.array()
        });
      }

      if (!req.files || req.files.length === 0) {
        console.log("[DEBUG] submitSolution missing files");
        return res.status(400).json({
          message: "At least one solution file is required"
        });
      }

      const solutionData = {
        ...req.body,
        files: req.files.map(file => file.path)
      };

      const solution = await solutionService.createSolution(
        solutionData,
        req.user.id
      );

      console.log("[DEBUG] submitSolution success", solution._id);
      res.status(201).json(solution);
    } catch (error) {
      console.error("[ERROR] submitSolution", error);
      res.status(400).json({
        message: error.message
      });
    }
  };

/*
====================================
GET ALL SOLUTIONS
====================================
*/

const getAllSolutions =
  async (req, res) => {

    try {

      const solutions =
        await solutionService.getAllSolutions();

      res.status(200).json(
        solutions
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

/*
====================================
MY SOLUTIONS
====================================
*/

const getMySolutions =
  async (req, res) => {

    try {

      const solutions =
        await solutionService.getMySolutions(
          req.user.id
        );

      res.status(200).json(
        solutions
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

const getMyApprovedSolutions =
  async (req, res) => {
    try {
      const solutions =
        await solutionService.getMyApprovedSolutions(
          req.user.id
        );
      res.status(200).json(solutions);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

const getLatestSolutionByTaskId =
  async (req, res) => {
    try {
      const solution =
        await solutionService.getLatestSolutionByTaskId(
          req.params.taskId
        );

      if (!solution) {
        return res.status(404).json({
          message: "Solution not found"
        });
      }

      res.status(200).json(solution);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

const getApprovedRepository =
  async (req, res) => {
    try {
      const filters = {
        employee: req.query.employee,
        team: req.query.team,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        solutionType: req.query.solutionType
      };

      const solutions =
        await solutionService.getApprovedSolutions(
          filters
        );

      res.status(200).json(solutions);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

/*
====================================
GET SOLUTION BY ID
====================================
*/

const getSolutionById =
  async (req, res) => {

    try {

      const solution =
        await solutionService.getSolutionById(
          req.params.id
        );

      res.status(200).json(
        solution
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

/*
====================================
PENDING REVIEWS
====================================
*/

const getPendingReviews =
  async (req, res) => {

    try {

      const solutions =
        await solutionService.getPendingReviews();

      res.status(200).json(
        solutions
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

/*
====================================
APPROVE SOLUTION
====================================
*/

const approveSolution =
  async (req, res) => {

    try {

      const solution =
        await solutionService.approveSolution(
          req.params.id
        );

      res.status(200).json(
        solution
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

/*
====================================
REWORK SOLUTION
====================================
*/

const reworkSolution =
  async (req, res) => {

    try {

      const solution =
        await solutionService.reworkSolution(
          req.params.id
        );

      res.status(200).json(
        solution
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };
/*
====================================
MY REWORK SOLUTIONS
====================================
*/

const getMyReworkSolutions = async (req, res) => {
  try {
    const solutions =
      await solutionService.getMyReworkSolutions(
        req.user.id
      );

    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/*
====================================
MY HISTORY
====================================
*/

const getMyHistory = async (req, res) => {
  try {
    const solutions =
      await solutionService.getMyHistory(
        req.user.id
      );

    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/*
====================================
REWORK REPOSITORY
====================================
*/

const getReworkRepository = async (req, res) => {
  try {
    const solutions =
      await solutionService.getReworkRepository();

    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/*
====================================
HISTORY REPOSITORY
====================================
*/

const getHistoryRepository = async (req, res) => {
  try {
    const solutions =
      await solutionService.getHistoryRepository();

    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  submitSolution,
  getAllSolutions,
  getMySolutions,
  getMyApprovedSolutions,
  getMyReworkSolutions,
  getMyHistory,
  getLatestSolutionByTaskId,
  getApprovedRepository,
  getReworkRepository,
  getHistoryRepository,
  getSolutionById,
  getPendingReviews,
  approveSolution,
  reworkSolution
};