const User =
  require("../../models/User");

const Task =
  require("../../models/Task");

const Solution =
  require("../../models/Solution");

const searchEmployees =
  async (name) => {

    return await User.find({
      name: {
        $regex: name,
        $options: "i"
      },
      role: "EMPLOYEE"
    }).select(
      "name email employeeId team qualification"
    );
  };

const searchTasks =
  async (studentName) => {

    return await Task.find({
      studentName: {
        $regex: studentName,
        $options: "i"
      }
    });
  };

const searchSolutions =
  async (studentName) => {

    return await Solution.find()
      .populate(
        "taskId",
        "studentName moduleCode"
      )
      .populate(
        "employeeId",
        "name employeeId team"
      );
  };

module.exports = {
  searchEmployees,
  searchTasks,
  searchSolutions
};