const Solution =
  require("../../models/Solution");

const getAllSolutions =
  async () => {

    const solutions =
      await Solution.find()
        .populate(
          "employeeId",
          "name email employeeId team"
        )
        .populate(
          "taskId",
          "studentName moduleCode"
        );

    return solutions;
  };

const getMySolutions =
  async (employeeId) => {

    const solutions =
      await Solution.find({
        employeeId
      })
        .populate(
          "taskId",
          "studentName moduleCode"
        );

    return solutions;
  };

const getSolutionById =
  async (solutionId) => {

    const solution =
      await Solution.findById(
        solutionId
      )
        .populate(
          "employeeId",
          "name email employeeId team"
        )
        .populate(
          "taskId",
          "studentName moduleCode"
        );

    return solution;
  };

module.exports = {
  getAllSolutions,
  getMySolutions,
  getSolutionById
};