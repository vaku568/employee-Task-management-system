const { body } = require("express-validator");

console.log(
  "Validation file loaded successfully"
);

const createSolutionValidation = [
  body("taskId")
    .notEmpty()
    .withMessage(
      "Task ID is required"
    ),

  body("solutionType")
    .notEmpty()
    .withMessage(
      "Solution type is required"
    )
    .isIn([
      "FINAL",
      "PARAPHRASE"
    ])
    .withMessage(
      "Solution type must be FINAL or PARAPHRASE"
    )
];

module.exports = {
  createSolutionValidation
};