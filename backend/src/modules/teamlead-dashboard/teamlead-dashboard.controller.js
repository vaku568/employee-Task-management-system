const dashboardService =
  require("./teamlead-dashboard.service");

const getTeamLeadDashboard =
  async (req, res) => {

    try {

      const teamLeadId = req.user.id;
      const dashboard =
        await dashboardService.getTeamLeadDashboard(teamLeadId);

      res.status(200).json(
        dashboard
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

module.exports = {
  getTeamLeadDashboard
};