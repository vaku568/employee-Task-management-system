const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");

const {
  loginValidation
} = require("./auth.validation");

router.post(
  "/login",
  loginValidation,
  authController.login
);

module.exports = router;