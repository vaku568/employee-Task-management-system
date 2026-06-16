const solutionService =
  require("./solution.service");

const getAllSolutions =
  async (req, res) => {
    try {

      const solutions =
        await solutionService.getAllSolutions();

      res.status(200).json(
        solutions
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

const getMySolutions =
  async (req, res) => {
    try {

      const solutions =
        await solutionService.getMySolutions(
          req.user.id
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

const getSolutionById =
  async (req, res) => {
    try {

      const solution =
        await solutionService.getSolutionById(
          req.params.id
        );

      res.status(200).json(
        solution
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

module.exports = {
  getAllSolutions,
  getMySolutions,
  getSolutionById
};