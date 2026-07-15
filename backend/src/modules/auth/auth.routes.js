const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");

const authMiddleware = require("../../middleware/authMiddleware");

const {
  loginValidation
} = require("./auth.validation");

router.post(
  "/login",
  loginValidation,
  authController.login
);

router.get(
  "/me",
  authMiddleware,
  authController.getCurrentUser
);

module.exports = router;