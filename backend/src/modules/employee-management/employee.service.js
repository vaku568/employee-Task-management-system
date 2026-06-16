const User = require("../../models/User");
const hashPassword = require("../../utils/hashPassword");

const createEmployee = async (employeeData) => {

  const existingUser = await User.findOne({
    email: employeeData.email
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  employeeData.password = await hashPassword(
    employeeData.password
  );

  employeeData.role = "EMPLOYEE";

  const employee = await User.create(employeeData);

  return employee;
};

const getAllEmployees = async () => {

  return await User.find(
    { role: "EMPLOYEE" },
    { password: 0 }
  );

};

const getEmployeeById = async (id) => {

  const employee = await User.findById(
    id,
    { password: 0 }
  );

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

const updateEmployee = async (id, updateData) => {

  const employee = await User.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).select("-password");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

const deleteEmployee = async (id) => {

  const employee = await User.findByIdAndDelete(id);

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};