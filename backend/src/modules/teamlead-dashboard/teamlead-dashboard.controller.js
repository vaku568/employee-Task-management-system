const dashboardService =
  require("./teamlead-dashboard.service");

const getTeamLeadDashboard =
  async (req, res) => {

    try {

      const dashboard =
        await dashboardService.getTeamLeadDashboard();

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