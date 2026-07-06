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

const getAssignedTasks =
  async (req, res) => {

    try {

      const tasks =
        await dashboardService.getAssignedTasks(
          req.user.id
        );

      res.status(200).json(
        tasks
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

/*
====================================
ACCEPT TASK
ASSIGNED -> PROGRESS
====================================
*/

const acceptTask =
  async (req, res) => {

    try {

      const task =
        await dashboardService.acceptTask(
          req.params.id
        );

      res.status(200).json(
        task
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

module.exports = {
  getEmployeeDashboard,
  getAssignedTasks,
  acceptTask
};