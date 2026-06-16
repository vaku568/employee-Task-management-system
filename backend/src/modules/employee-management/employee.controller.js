const { validationResult } = require("express-validator");

const employeeService = require("./employee.service");

const createEmployee = async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const employee =
      await employeeService.createEmployee(
        req.body
      );

    res.status(201).json(employee);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }
};

const getAllEmployees = async (req, res) => {
  try {

    const employees =
      await employeeService.getAllEmployees();

    res.status(200).json(employees);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const getEmployeeById = async (req, res) => {
  try {

    const employee =
      await employeeService.getEmployeeById(
        req.params.id
      );

    res.status(200).json(employee);

  } catch (error) {

    res.status(404).json({
      message: error.message
    });

  }
};

const updateEmployee = async (req, res) => {
  try {

    const employee =
      await employeeService.updateEmployee(
        req.params.id,
        req.body
      );

    res.status(200).json(employee);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }
};

const deleteEmployee = async (req, res) => {
  try {

    await employeeService.deleteEmployee(
      req.params.id
    );

    res.status(200).json({
      message: "Employee deleted successfully"
    });

  } catch (error) {

    res.status(404).json({
      message: error.message
    });

  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};