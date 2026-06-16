const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const searchController =
  require("./search-filter.controller");

router.get(
  "/employees",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  searchController.searchEmployees
);

router.get(
  "/tasks",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  searchController.searchTasks
);

router.get(
  "/solutions",
  authMiddleware,
  roleMiddleware("TEAM_LEAD"),
  searchController.searchSolutions
);

module.exports = router;