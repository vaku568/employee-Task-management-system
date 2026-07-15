const User = require("../../models/User");
const Task = require("../../models/Task");
const Solution = require("../../models/Solution");
const TeamChat = require("../../models/TeamChat");
const Notification = require("../../models/Notification");
const hashPassword = require("../../utils/hashPassword");
const mongoose = require("mongoose");

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

  // No notification on registration - employee is pending approval

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

const getApprovedEmployees =
  async () => {

    return await User.find(
      {
        role: "EMPLOYEE",
        status: "APPROVED"
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
  async (id, teamLeadId) => {

    // Convert string IDs to ObjectId if necessary
    const employeeObjectId = typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id;
    const teamLeadObjectId = typeof teamLeadId === 'string' ? new mongoose.Types.ObjectId(teamLeadId) : teamLeadId;

    const employee =
      await User.findByIdAndUpdate(
        employeeObjectId,
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

    // Create notification for the employee
    try {
      await notificationService.createNotification(
        teamLeadObjectId,
        employeeObjectId,
        "Account Approved",
        "Your account has been approved by Team Lead. You can now login.",
        "EMPLOYEE_REGISTRATION_APPROVED",
        employeeObjectId
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    return employee;
  };

const rejectEmployee =
  async (id, teamLeadId) => {

    // Convert string IDs to ObjectId if necessary
    const employeeObjectId = typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id;
    const teamLeadObjectId = typeof teamLeadId === 'string' ? new mongoose.Types.ObjectId(teamLeadId) : teamLeadId;

    const employee =
      await User.findByIdAndUpdate(
        employeeObjectId,
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

    // Create notification for the employee
    try {
      await notificationService.createNotification(
        teamLeadObjectId,
        employeeObjectId,
        "Account Rejected",
        "Your account request has been rejected by Team Lead.",
        "EMPLOYEE_REGISTRATION_REJECTED",
        employeeObjectId
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    return employee;
  };

const deleteEmployee = async (id) => {
  const employee = await User.findById(id);

  if (!employee) {
    throw new Error("Employee not found");
  }

  // Check for assigned tasks
  const assignedTasks = await Task.countDocuments({ assignedTo: id });
  if (assignedTasks > 0) {
    throw new Error("Cannot delete employee because assigned tasks exist");
  }

  // Check for pending solutions
  const pendingSolutions = await Solution.countDocuments({ createdBy: id });
  if (pendingSolutions > 0) {
    throw new Error("Cannot delete employee because pending solutions exist");
  }

  // Check for active chats
  const activeChats = await Chat.countDocuments({ $or: [{ sender: id }, { receiver: id }] });
  if (activeChats > 0) {
    throw new Error("Cannot delete employee because active chats exist");
  }

  // Check for unread notifications
  const unreadNotifications = await Notification.countDocuments({ userId: id, isRead: false });
  if (unreadNotifications > 0) {
    throw new Error("Cannot delete employee because unread notifications exist");
  }

  // Delete all related records
  await Task.deleteMany({ assignedTo: id });
  await Solution.deleteMany({ createdBy: id });
  await Chat.deleteMany({ $or: [{ sender: id }, { receiver: id }] });
  await Notification.deleteMany({ userId: id });

  // Delete the employee
  await User.findByIdAndDelete(id);

  return employee;
};

const updateEmployee = async (id, updateData) => {
  const employee = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).select("-password");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getPendingEmployees,
  getApprovedEmployees,
  getEmployeeById,
  approveEmployee,
  rejectEmployee,
  deleteEmployee,
  updateEmployee
};