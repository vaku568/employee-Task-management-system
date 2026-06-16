const User =
  require("../../models/User");

const getAllTeams =
  async () => {

    const teams =
      await User.distinct("team");

    return teams;
  };

const getEmployeesByTeam =
  async (teamName) => {

    const employees =
      await User.find({
        team: teamName,
        role: "EMPLOYEE"
      }).select(
        "name email employeeId team qualification"
      );

    return employees;
  };

module.exports = {
  getAllTeams,
  getEmployeesByTeam
};