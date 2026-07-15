const User = require("../../models/User");
const comparePassword =
  require("../../utils/comparePassword");

const generateToken =
  require("../../utils/generateToken");

const mongoose = require("mongoose");

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

const getCurrentUser = async (userId) => {
  try {
    console.log("[DEBUG] getCurrentUser - userId:", userId);
    console.log("[DEBUG] getCurrentUser - userId type:", typeof userId);
    console.log("[DEBUG] getCurrentUser - userId string:", String(userId));
    
    // Convert string ID to ObjectId if necessary
    const objectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    console.log("[DEBUG] getCurrentUser - objectId:", objectId);
    console.log("[DEBUG] getCurrentUser - objectId type:", typeof objectId);
    
    const user = await User.findById(objectId).select("-password");
    
    console.log("[DEBUG] getCurrentUser - user found:", user ? "YES" : "NO");
    if (user) {
      console.log("[DEBUG] getCurrentUser - user._id:", user._id);
      console.log("[DEBUG] getCurrentUser - user._id string:", String(user._id));
    }
    
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

module.exports = {
  loginUser,
  getCurrentUser
};