const mongoose = require("mongoose");
const EmployeeDailyReport = require("../../models/EmployeeDailyReport");
const Task = require("../../models/Task");
const User = require("../../models/User");

const createEODReport = async (reportData) => {
  console.log("[DEBUG] createEODReport - Creating report for employee:", reportData.employeeId);
  
  const report = await EmployeeDailyReport.create(reportData);
  
  const populatedReport = await EmployeeDailyReport.findById(report._id)
    .populate("employeeId", "name employeeId")
    .populate("taskIds", "studentName moduleCode description");
  
  console.log("[DEBUG] createEODReport - Report created successfully:", populatedReport._id);
  return populatedReport;
};

const getMyEODReports = async (employeeId) => {
  console.log("[DEBUG] getMyEODReports - Fetching reports for employee:", employeeId);
  
  const reports = await EmployeeDailyReport.find({ employeeId })
    .populate("taskIds", "studentName moduleCode description")
    .sort({ date: -1, submittedAt: -1 });
  
  console.log("[DEBUG] getMyEODReports - Found reports:", reports.length);
  return reports;
};

const getEODStats = async (employeeId) => {
  console.log("[DEBUG] getEODStats - Calculating stats for employee:", employeeId);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);
  
  const todayReports = await EmployeeDailyReport.countDocuments({
    employeeId,
    date: { $gte: today }
  });
  
  const totalReports = await EmployeeDailyReport.countDocuments({ employeeId });
  
  const currentMonthReports = await EmployeeDailyReport.countDocuments({
    employeeId,
    date: { $gte: currentMonth }
  });
  
  const totalWordsResult = await EmployeeDailyReport.aggregate([
    { $match: { employeeId: mongoose.Types.ObjectId(employeeId) } },
    { $group: { _id: null, totalWords: { $sum: "$wordCount" } } }
  ]);
  
  const totalWords = totalWordsResult.length > 0 ? totalWordsResult[0].totalWords : 0;
  
  console.log("[DEBUG] getEODStats - Stats:", { todayReports, totalReports, currentMonthReports, totalWords });
  
  return {
    todayReports,
    totalReports,
    currentMonthReports,
    totalWords
  };
};

const getEmployeeAssignedTasks = async (employeeId, filters = {}) => {
  console.log("[DEBUG] getEmployeeAssignedTasks - Fetching tasks for employee:", employeeId, "filters:", filters);
  
  const query = { assignedTo: employeeId };
  
  // Filter by status if provided (and not "All")
  if (filters.status && filters.status !== "All") {
    query.status = filters.status;
  }
  
  // Filter by assigned date if provided
  if (filters.date) {
    const selectedDate = new Date(filters.date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    query.assignedAt = {
      $gte: selectedDate,
      $lt: nextDay
    };
  }
  
  // Search filter
  let tasksQuery = Task.find(query)
    .select("studentName moduleCode university description assignedAt status")
    .sort({ createdAt: -1 });
  
  // Apply search filter if provided
  if (filters.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    tasksQuery = tasksQuery.or([
      { studentName: searchRegex },
      { moduleCode: searchRegex },
      { university: searchRegex },
      { description: searchRegex }
    ]);
  }
  
  const tasks = await tasksQuery;
  
  console.log("[DEBUG] getEmployeeAssignedTasks - Found tasks:", tasks.length);
  return tasks;
};

const getEmployeeTeamLead = async (employeeId) => {
  console.log("[DEBUG] getEmployeeTeamLead - Fetching team lead for employee:", employeeId);
  
  const employee = await User.findById(employeeId).select("team");
  
  if (!employee) {
    return null;
  }
  
  const teamLead = await User.findOne({
    role: "TEAM_LEAD",
    team: employee.team,
    status: "APPROVED"
  }).select("name");
  
  console.log("[DEBUG] getEmployeeTeamLead - Team lead:", teamLead?.name || "Not found");
  return teamLead;
};

const updateEODReport = async (reportId, reportData) => {
  console.log("[DEBUG] updateEODReport - Updating report:", reportId);
  
  const report = await EmployeeDailyReport.findByIdAndUpdate(
    reportId,
    reportData,
    { new: true, runValidators: true }
  ).populate("taskIds", "studentName moduleCode description");
  
  console.log("[DEBUG] updateEODReport - Report updated successfully:", report._id);
  return report;
};

module.exports = {
  createEODReport,
  getMyEODReports,
  getEODStats,
  getEmployeeAssignedTasks,
  getEmployeeTeamLead,
  updateEODReport
};
