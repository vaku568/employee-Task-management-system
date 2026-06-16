const teamService =
  require("./team-management.service");

const getAllTeams =
  async (req, res) => {
    try {

      const teams =
        await teamService.getAllTeams();

      res.status(200).json(
        teams
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

const getEmployeesByTeam =
  async (req, res) => {
    try {

      const employees =
        await teamService.getEmployeesByTeam(
          req.params.teamName
        );

      res.status(200).json(
        employees
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

module.exports = {
  getAllTeams,
  getEmployeesByTeam
};