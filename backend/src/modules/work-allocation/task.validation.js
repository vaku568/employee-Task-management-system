const { body } = require("express-validator");

const createTaskValidation = [
  body("studentName")
    .notEmpty()
    .withMessage("Student Name is required"),

  body("university")
    .notEmpty()
    .withMessage("University is required"),

  body("moduleCode")
    .notEmpty()
    .withMessage("Module Code is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("assignedTo")
    .notEmpty()
    .withMessage("Employee ID is required")
];

module.exports = {
  createTaskValidation
};