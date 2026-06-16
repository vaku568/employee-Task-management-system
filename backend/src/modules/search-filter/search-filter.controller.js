const searchService =
  require("./search-filter.service");

const searchEmployees =
  async (req, res) => {
    try {

      const employees =
        await searchService.searchEmployees(
          req.query.name || ""
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

const searchTasks =
  async (req, res) => {
    try {

      const tasks =
        await searchService.searchTasks(
          req.query.studentName || ""
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

const searchSolutions =
  async (req, res) => {
    try {

      const solutions =
        await searchService.searchSolutions(
          req.query.studentName || ""
        );

      res.status(200).json(
        solutions
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

module.exports = {
  searchEmployees,
  searchTasks,
  searchSolutions
};