const User = require("../../models/User");
const comparePassword =
  require("../../utils/comparePassword");

const generateToken =
  require("../../utils/generateToken");

const loginUser = async (
  email,
  password
) => {

  const user =
    await User.findOne({
      email
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const isMatch =
    await comparePassword(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  /*
  ====================================
  Employee Approval Validation
  ====================================
  */

  if (
    user.role === "EMPLOYEE"
  ) {

    if (
      user.status === "PENDING"
    ) {

      throw new Error(
        "Your account is waiting for Team Lead approval."
      );

    }

    if (
      user.status === "REJECTED"
    ) {

      throw new Error(
        "Your account has been rejected by Team Lead."
      );

    }

  }

  /*
  ====================================
  Generate JWT Token
  ====================================
  */

  const token =
    generateToken(user);

  return {
    token,
    user
  };

};

module.exports = {
  loginUser
};