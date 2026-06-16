const dashboardService =
  require("./employee-dashboard.service");

const getEmployeeDashboard =
  async (req, res) => {
    try {

      const dashboard =
        await dashboardService.getEmployeeDashboard(
          req.user.id
        );

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
  getEmployeeDashboard
};