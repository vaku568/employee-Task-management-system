const User = require("../../models/User");
const hashPassword = require("../../utils/hashPassword");

const notificationService =
  require("../notifications/notification.service");

const generateEmployeeId = async () => {

  const count =
    await User.countDocuments({
      role: "EMPLOYEE"
    });

  const year =
    new Date().getFullYear();

  return `EMPSANDSPACE${year}${String(
    count + 1
  ).padStart(3, "0")}`;
};

const createEmployee = async (employeeData) => {

  const existingUser =
    await User.findOne({
      email: employeeData.email
    });

  if (existingUser) {
    throw new Error(
      "Email already exists"
    );
  }

  employeeData.password =
    await hashPassword(
      employeeData.password
    );

  employeeData.role =
    "EMPLOYEE";

  employeeData.status =
    "PENDING";

  employeeData.employeeId =
    await generateEmployeeId();

  const employee =
    await User.create(
      employeeData
    );

  await notificationService.createNotification(
    employee._id,
    "Registration Submitted",
    "Your account has been created successfully and is waiting for Team Lead approval."
  );

  return employee;
};

const getAllEmployees =
  async () => {

    return await User.find(
      { role: "EMPLOYEE" },
      { password: 0 }
    );

  };

const getPendingEmployees =
  async () => {

    return await User.find(
      {
        role: "EMPLOYEE",
        status: "PENDING"
      },
      {
        password: 0
      }
    );

  };

const getEmployeeById =
  async (id) => {

    const employee =
      await User.findById(
        id,
        { password: 0 }
      );

    if (!employee) {
      throw new Error(
        "Employee not found"
      );
    }

    return employee;
  };

const approveEmployee =
  async (id) => {

    const employee =
      await User.findByIdAndUpdate(
        id,
        {
          status: "APPROVED"
        },
        {
          new: true
        }
      );

    if (!employee) {
      throw new Error(
        "Employee not found"
      );
    }

    await notificationService.createNotification(
      employee._id,
      "Account Approved",
      "Your account has been approved by Team Lead. You can now login."
    );

    return employee;
  };

const rejectEmployee =
  async (id) => {

    const employee =
      await User.findByIdAndUpdate(
        id,
        {
          status: "REJECTED"
        },
        {
          new: true
        }
      );

    if (!employee) {
      throw new Error(
        "Employee not found"
      );
    }

    await notificationService.createNotification(
      employee._id,
      "Account Rejected",
      "Your account request has been rejected by Team Lead."
    );

    return employee;
  };

module.exports = {
  createEmployee,
  getAllEmployees,
  getPendingEmployees,
  getEmployeeById,
  approveEmployee,
  rejectEmployee
};