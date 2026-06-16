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

    res.status(401).json({
      message: error.message
    });

  }
};

module.exports = {
  login
};