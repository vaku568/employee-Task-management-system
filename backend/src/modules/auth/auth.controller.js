const { validationResult } = require("express-validator");

const authService = require("./auth.service");

const login = async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const result = await authService.loginUser(
      email,
      password
    );

    res.status(200).json(result);

  } catch (error) {

    // Return 403 for approval status issues
    if (error.message.includes("waiting for Team Lead approval") ||
        error.message.includes("rejected by Team Lead")) {
      return res.status(403).json({
        message: error.message,
        status: "APPROVAL_REQUIRED"
      });
    }

    res.status(401).json({
      message: error.message
    });

  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};

module.exports = {
  login,
  getCurrentUser
};