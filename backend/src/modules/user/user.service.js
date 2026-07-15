const User = require("../../models/User");

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateProfile = async (userId, updateData) => {
  // Only allow updating specific fields
  const allowedFields = ["phoneNumber", "email", "team", "designation", "profilePhoto"];
  
  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    filteredData,
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

module.exports = {
  getProfile,
  updateProfile,
};
