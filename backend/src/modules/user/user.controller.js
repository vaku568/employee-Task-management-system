const userService = require("./user.service");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await userService.getProfile(userId);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    const updatedProfile = await userService.updateProfile(userId, updateData);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
