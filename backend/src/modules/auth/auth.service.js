const User = require("../../models/User");
const comparePassword = require("../../utils/comparePassword");
const generateToken = require("../../utils/generateToken");

const loginUser = async (email, password) => {

  console.log("Email received:", email);

  const user = await User.findOne({ email });

  console.log("User found:", user);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await comparePassword(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  return {
    token,
    user
  };
};

module.exports = {
  loginUser
};