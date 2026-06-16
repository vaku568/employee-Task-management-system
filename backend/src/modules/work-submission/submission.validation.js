const { body } =
  require("express-validator");

const createSubmissionValidation = [

  body("taskId")
    .notEmpty()
    .withMessage(
      "Task ID is required"
    ),

  body("submissionType")
    .notEmpty()
    .withMessage(
      "Submission Type is required"
    )
    .isIn([
      "FINAL",
      "PARAPHRASE"
    ])
    .withMessage(
      "Submission Type must be FINAL or PARAPHRASE"
    )

];

module.exports = {
  createSubmissionValidation
};