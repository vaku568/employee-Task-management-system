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

/*
====================================
Employee Registration
====================================
*/

router.post(
  "/register",
  createEmployeeValidation,
  employeeController.createEmployee
);

/*
====================================
Team Lead Operations
====================================
*/

router.get(
  "/",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.getAllEmployees
);

router.get(
  "/approved",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.getApprovedEmployees
);

router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.getPendingEmployees
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.getEmployeeById
);

router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.approveEmployee
);

router.put(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.rejectEmployee
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.deleteEmployee
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  employeeController.updateEmployee
);

module.exports = router;