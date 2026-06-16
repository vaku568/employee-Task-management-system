const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const employeeController =
  require("./employee.controller");

const {
  createEmployeeValidation
} = require("./employee.validation");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  createEmployeeValidation,
  employeeController.createEmployee
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.getAllEmployees
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.getEmployeeById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.updateEmployee
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.deleteEmployee
);

module.exports = router;