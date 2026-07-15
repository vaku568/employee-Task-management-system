const employeeDailyReportService = require("./employee-daily-report.service");

const createEODReport = async (req, res) => {
  try {
    console.log("[DEBUG] createEODReport controller - User ID:", req.user.id);
    console.log("[DEBUG] createEODReport controller - Request body:", req.body);

    const reportData = {
      ...req.body,
      employeeId: req.user.id
    };

    const report = await employeeDailyReportService.createEODReport(reportData);
    
    console.log("[DEBUG] createEODReport controller - Report created successfully");
    res.status(201).json(report);
  } catch (error) {
    console.error("[ERROR] createEODReport:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already submitted a report for this task on this date."
      });
    }
    
    res.status(500).json({
      message: error.message || "Failed to create EOD report"
    });
  }
};

const getMyEODReports = async (req, res) => {
  try {
    console.log("[DEBUG] getMyEODReports controller - User ID:", req.user.id);
    
    const reports = await employeeDailyReportService.getMyEODReports(req.user.id);
    
    console.log("[DEBUG] getMyEODReports controller - Returning reports:", reports.length);
    res.status(200).json(reports);
  } catch (error) {
    console.error("[ERROR] getMyEODReports:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch EOD reports"
    });
  }
};

const getEODStats = async (req, res) => {
  try {
    console.log("[DEBUG] getEODStats controller - User ID:", req.user.id);
    
    const stats = await employeeDailyReportService.getEODStats(req.user.id);
    
    console.log("[DEBUG] getEODStats controller - Returning stats:", stats);
    res.status(200).json(stats);
  } catch (error) {
    console.error("[ERROR] getEODStats:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch EOD statistics"
    });
  }
};

const getEmployeeAssignedTasks = async (req, res) => {
  try {
    console.log("[DEBUG] getEmployeeAssignedTasks controller - User ID:", req.user.id);
    console.log("[DEBUG] getEmployeeAssignedTasks controller - Query params:", req.query);
    
    const filters = {
      search: req.query.search,
      date: req.query.date,
      status: req.query.status
    };
    
    const tasks = await employeeDailyReportService.getEmployeeAssignedTasks(req.user.id, filters);
    
    console.log("[DEBUG] getEmployeeAssignedTasks controller - Returning tasks:", tasks.length);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("[ERROR] getEmployeeAssignedTasks:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch assigned tasks"
    });
  }
};

const getEmployeeTeamLead = async (req, res) => {
  try {
    console.log("[DEBUG] getEmployeeTeamLead controller - User ID:", req.user.id);
    
    const teamLead = await employeeDailyReportService.getEmployeeTeamLead(req.user.id);
    
    console.log("[DEBUG] getEmployeeTeamLead controller - Returning team lead:", teamLead?.name);
    res.status(200).json(teamLead);
  } catch (error) {
    console.error("[ERROR] getEmployeeTeamLead:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch team lead information"
    });
  }
};

const updateEODReport = async (req, res) => {
  try {
    console.log("[DEBUG] updateEODReport controller - Report ID:", req.params.id);
    console.log("[DEBUG] updateEODReport controller - Request body:", req.body);
    
    const report = await employeeDailyReportService.updateEODReport(req.params.id, req.body);
    
    console.log("[DEBUG] updateEODReport controller - Report updated successfully");
    res.status(200).json(report);
  } catch (error) {
    console.error("[ERROR] updateEODReport:", error);
    res.status(500).json({
      message: error.message || "Failed to update EOD report"
    });
  }
};

module.exports = {
  createEODReport,
  getMyEODReports,
  getEODStats,
  getEmployeeAssignedTasks,
  getEmployeeTeamLead,
  updateEODReport
};
