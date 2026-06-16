const { body } = require("express-validator");

const createEmployeeValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  body("employeeId")
    .notEmpty()
    .withMessage("Employee ID is required"),

  body("qualification")
    .notEmpty()
    .withMessage("Qualification is required"),

  body("team")
    .notEmpty()
    .withMessage("Team is required")
];

module.exports = {
  createEmployeeValidation
};