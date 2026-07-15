const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../../middleware/authMiddleware");

// Get user profile
router.get("/profile", authMiddleware, userController.getProfile);

// Update user profile
router.put("/profile", authMiddleware, userController.updateProfile);

module.exports = router;
