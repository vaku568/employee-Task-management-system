const express = require("express");

const router = express.Router();

const authMiddleware =
require("../../middleware/authMiddleware");

const roleMiddleware =
require("../../middleware/roleMiddleware");

const solutionController =
require("./solution.controller");

router.get(
"/",
authMiddleware,
roleMiddleware("TEAM_LEAD"),
solutionController.getAllSolutions
);

router.get(
"/my-solutions",
authMiddleware,
roleMiddleware("EMPLOYEE"),
solutionController.getMySolutions
);

router.get(
"/:id",
authMiddleware,
roleMiddleware("TEAM_LEAD"),
solutionController.getSolutionById
);

module.exports = router;
