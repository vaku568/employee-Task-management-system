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

const getRecentAssignedTasks =
  async (req, res) => {

    try {

      const tasks =
        await dashboardService.getRecentAssignedTasks(
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

const getRecentCompletedWorks =
  async (req, res) => {

    try {

      const works =
        await dashboardService.getRecentCompletedWorks(
          req.user.id
        );

      res.status(200).json(
        works
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };

const getRecentActivity =
  async (req, res) => {

    try {

      const activities =
        await dashboardService.getRecentActivity(
          req.user.id
        );

      res.status(200).json(
        activities
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
  getRecentAssignedTasks,
  getRecentCompletedWorks,
  getRecentActivity,
  getAssignedTasks,
  acceptTask
};