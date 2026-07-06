const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const upload =
  require("../../config/multer");

const solutionController =
  require("./solution.controller");

const {
  createSolutionValidation
} = require("./solution.validation");

/*
====================================
EMPLOYEE SUBMIT SOLUTION
====================================
*/

router.post(
  "/",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  upload.array("files", 10),
  createSolutionValidation,
  solutionController.submitSolution
);

/*
====================================
TEAM LEAD VIEW ALL SOLUTIONS
====================================
*/

router.get(
  "/",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  solutionController.getAllSolutions
);

/*
====================================
EMPLOYEE SOLUTIONS
====================================
*/

router.get(
  "/my-solutions",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  solutionController.getMySolutions
);

router.get(
  "/my-approved",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  solutionController.getMyApprovedSolutions
);

router.get(
  "/my-rework",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  solutionController.getMyReworkSolutions
);

router.get(
  "/my-history",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  solutionController.getMyHistory
);

/*
====================================
TEAM LEAD REPOSITORIES
====================================
*/

router.get(
  "/approved-repository",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  solutionController.getApprovedRepository
);

router.get(
  "/rework-repository",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  solutionController.getReworkRepository
);

router.get(
  "/history-repository",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  solutionController.getHistoryRepository
);

/*
====================================
TEAM LEAD REVIEW QUEUE
====================================
*/

router.get(
  "/pending-review/list",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  solutionController.getPendingReviews
);

/*
====================================
TEAM LEAD VIEW TASK SOLUTION
====================================
*/

router.get(
  "/task/:taskId",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  solutionController.getLatestSolutionByTaskId
);

/*
====================================
APPROVE SOLUTION
====================================
*/

router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  solutionController.approveSolution
);

/*
====================================
REWORK SOLUTION
====================================
*/

router.put(
  "/:id/rework",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  solutionController.reworkSolution
);

/*
====================================
VIEW SINGLE SOLUTION
KEEP THIS LAST
====================================
*/

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  solutionController.getSolutionById
);

module.exports = router;