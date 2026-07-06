const { validationResult } =
  require("express-validator");

const employeeService =
  require("./employee.service");

const createEmployee =
  async (req, res) => {

    try {

      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {

        return res.status(400).json({
          errors:
            errors.array()
        });

      }

      const employee =
        await employeeService.createEmployee(
          req.body
        );

      res.status(201).json({
        message:
          "Account created successfully. Waiting for Team Lead approval.",
        employee
      });

    } catch (error) {

      res.status(400).json({
        message:
          error.message
      });

    }

  };

const getAllEmployees =
  async (req, res) => {

    try {

      const employees =
        await employeeService.getAllEmployees();

      res.status(200).json(
        employees
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

  };

const getPendingEmployees =
  async (req, res) => {

    try {

      const employees =
        await employeeService.getPendingEmployees();

      res.status(200).json(
        employees
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

  };

const getEmployeeById =
  async (req, res) => {

    try {

      const employee =
        await employeeService.getEmployeeById(
          req.params.id
        );

      res.status(200).json(
        employee
      );

    } catch (error) {

      res.status(404).json({
        message:
          error.message
      });

    }

  };

const approveEmployee =
  async (req, res) => {

    try {

      const employee =
        await employeeService.approveEmployee(
          req.params.id
        );

      res.status(200).json({
        message:
          "Employee approved successfully",
        employee
      });

    } catch (error) {

      res.status(400).json({
        message:
          error.message
      });

    }

  };

const rejectEmployee =
  async (req, res) => {

    try {

      const employee =
        await employeeService.rejectEmployee(
          req.params.id
        );

      res.status(200).json({
        message:
          "Employee rejected successfully",
        employee
      });

    } catch (error) {

      res.status(400).json({
        message:
          error.message
      });

    }

  };

module.exports = {
  createEmployee,
  getAllEmployees,
  getPendingEmployees,
  getEmployeeById,
  approveEmployee,
  rejectEmployee
};