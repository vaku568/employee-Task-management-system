import { useEffect, useMemo, useState, useCallback } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

import {
  Description,
  TrendingUp,
  Assignment,
  CalendarToday,
  Edit as EditIcon,
} from "@mui/icons-material";

import axiosInstance from "../../services/axiosInstance";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import PageHeader from "../../components/layout/PageHeader";
import GlassContainer from "../../components/layout/GlassContainer";

//==================================================
// Utility Functions
//==================================================

const formatDate = (dateString) => {
  if (!dateString) return "--";
  return new Date(dateString).toLocaleDateString();
};

const formatDateTime = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return num.toLocaleString();
};

//==================================================
// Main Component
//==================================================

const EmployeeDailyReports = () => {
  //--------------------------------------------------
  // States
  //--------------------------------------------------

  const [reports, setReports] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [teamLead, setTeamLead] = useState(null);
  const [stats, setStats] = useState({
    todayReports: 0,
    totalReports: 0,
    currentMonthReports: 0,
    totalWords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    date: new Date(),
    taskIds: [],
    typesOfWork: [],
    wordCount: "",
    summary: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReportId, setEditingReportId] = useState(null);

  // Dialog States
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [workTypeDialogOpen, setWorkTypeDialogOpen] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [taskFilters, setTaskFilters] = useState({
    search: "",
    date: null,
    status: "All",
  });
  const [tempSelectedTasks, setTempSelectedTasks] = useState([]);
  const [tempSelectedWorkTypes, setTempSelectedWorkTypes] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("user")) || null;

  const taskStatusOptions = ["All", "ASSIGNED", "PROGRESS", "FINAL", "PARAPHRASE", "APPROVED", "REWORK"];

  const typeOfWorkOptions = [
    "Assignment",
    "Paraphrasing",
    "Research",
    "Presentation",
    "Report",
    "Dissertation",
    "Editing",
    "Formatting",
    "Referencing",
    "Report Writing",
    "Literature Review",
    "Other",
  ];

  //--------------------------------------------------
  // API Calls
  //--------------------------------------------------

  const fetchAssignedTasks = useCallback(async (date) => {
    try {
      const formattedDate = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const res = await axiosInstance.get(`/reports/eod/assigned-tasks?date=${formattedDate}`);
      setAssignedTasks(res.data);
    } catch (err) {
      console.error("Fetch assigned tasks error:", err);
    }
  }, []);

  const fetchAllTasks = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.date) params.append('date', filters.date.toISOString().split('T')[0]);
      if (filters.status) params.append('status', filters.status);
      
      const res = await axiosInstance.get(`/reports/eod/assigned-tasks?${params.toString()}`);
      setAllTasks(res.data);
    } catch (err) {
      console.error("Fetch all tasks error:", err);
    }
  }, []);

  const fetchTeamLead = useCallback(async () => {
    // No backend dependency - just set to "Team Lead"
    setTeamLead({ name: "Team Lead" });
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/reports/eod/my");
      setReports(res.data);
    } catch (err) {
      console.error("Fetch reports error:", err);
    }
  }, []);

  const calculateStatistics = useCallback(() => {
    if (!reports || reports.length === 0) {
      setStats({
        todayReports: 0,
        totalReports: 0,
        currentMonthReports: 0,
        totalWords: 0,
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let todayReports = 0;
    let totalWords = 0;
    let currentMonthReports = 0;

    reports.forEach((report) => {
      // Count total words
      totalWords += report.wordCount || 0;

      // Check if today's report
      const reportDate = new Date(report.date);
      reportDate.setHours(0, 0, 0, 0);
      if (reportDate.getTime() === today.getTime()) {
        todayReports++;
      }

      // Check if current month report
      if (reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear) {
        currentMonthReports++;
      }
    });

    setStats({
      todayReports,
      totalReports: reports.length,
      currentMonthReports,
      totalWords,
    });
  }, [reports]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchAssignedTasks(formData.date),
      fetchTeamLead(),
      fetchReports(),
    ]);
    setLoading(false);
  }, [fetchAssignedTasks, fetchTeamLead, fetchReports, formData.date]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Calculate statistics whenever reports change
  useEffect(() => {
    calculateStatistics();
  }, [calculateStatistics]);

  //--------------------------------------------------
  // Form Handlers
  //--------------------------------------------------

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Reload tasks when date changes
    if (field === "date") {
      fetchAssignedTasks(value);
    }
  };

  const handleTaskToggle = (taskId) => {
    setFormData((prev) => {
      const newTaskIds = prev.taskIds.includes(taskId)
        ? prev.taskIds.filter((id) => id !== taskId)
        : [...prev.taskIds, taskId];
      return { ...prev, taskIds: newTaskIds };
    });
  };

  const handleTypeOfWorkToggle = (type) => {
    setFormData((prev) => {
      const newTypes = prev.typesOfWork.includes(type)
        ? prev.typesOfWork.filter((t) => t !== type)
        : [...prev.typesOfWork, type];
      return { ...prev, typesOfWork: newTypes };
    });
  };

  const handleEdit = (report) => {
    setIsEditMode(true);
    setEditingReportId(report._id);
    setFormData({
      date: new Date(report.date),
      taskIds: report.taskIds?.map((t) => t._id) || [],
      typesOfWork: report.typesOfWork || [],
      wordCount: report.wordCount.toString(),
      summary: report.summary,
    });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingReportId(null);
    setFormData({
      date: new Date(),
      taskIds: [],
      typesOfWork: [],
      wordCount: "",
      summary: "",
    });
  };

  // Dialog Handlers
  const handleOpenTaskDialog = () => {
    setTempSelectedTasks(formData.taskIds);
    setTaskDialogOpen(true);
    fetchAllTasks(taskFilters);
  };

  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false);
  };

  const handleSaveTasks = () => {
    setFormData((prev) => ({ ...prev, taskIds: tempSelectedTasks }));
    setTaskDialogOpen(false);
  };

  const handleTaskFilterChange = (field, value) => {
    setTaskFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleTempTaskToggle = (taskId) => {
    setTempSelectedTasks((prev) => {
      const newIds = prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId];
      return newIds;
    });
  };

  const handleOpenWorkTypeDialog = () => {
    setTempSelectedWorkTypes(formData.typesOfWork);
    setWorkTypeDialogOpen(true);
  };

  const handleCloseWorkTypeDialog = () => {
    setWorkTypeDialogOpen(false);
  };

  const handleSaveWorkTypes = () => {
    setFormData((prev) => ({ ...prev, typesOfWork: tempSelectedWorkTypes }));
    setWorkTypeDialogOpen(false);
  };

  const handleTempWorkTypeToggle = (type) => {
    setTempSelectedWorkTypes((prev) => {
      const newTypes = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      return newTypes;
    });
  };

  // Apply task filters when they change
  useEffect(() => {
    if (taskDialogOpen) {
      fetchAllTasks(taskFilters);
    }
  }, [taskFilters, taskDialogOpen, fetchAllTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.taskIds || formData.taskIds.length === 0) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please select at least one task.",
      });
      return;
    }

    if (!formData.typesOfWork || formData.typesOfWork.length === 0) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please select at least one type of work.",
      });
      return;
    }

    if (!formData.wordCount || formData.wordCount <= 0) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Word count must be greater than zero.",
      });
      return;
    }

    if (!formData.summary || formData.summary.trim().length === 0) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please enter work summary.",
      });
      return;
    }

    if (formData.summary.length > 500) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Summary must not exceed 500 characters.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const reportData = {
        date: formData.date,
        taskIds: formData.taskIds,
        typesOfWork: formData.typesOfWork,
        wordCount: parseInt(formData.wordCount),
        receivedFrom: "Team Lead",
        submittedTo: "Team Lead",
        summary: formData.summary,
      };

      if (isEditMode) {
        await axiosInstance.put(`/reports/eod/${editingReportId}`, reportData);
        setSnackbar({
          open: true,
          severity: "success",
          message: "EOD updated successfully!",
        });
      } else {
        await axiosInstance.post("/reports/eod", reportData);
        setSnackbar({
          open: true,
          severity: "success",
          message: "EOD submitted successfully!",
        });
      }

      // Clear form and reset edit mode
      handleCancelEdit();

      // Refresh data - statistics will auto-calculate when reports update
      await fetchReports();
    } catch (err) {
      console.error("Submit EOD error:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "Failed to submit EOD.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  //--------------------------------------------------
  // Filter Logic
  //--------------------------------------------------

  const sortedReports = useMemo(() => {
    const sorted = [...reports];
    return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [reports]);

  //--------------------------------------------------
  // Render
  //--------------------------------------------------

  return (
    <EmployeeLayout>
      <PageHeader
        title="EOD"
        subtitle="Submit your daily End of Day (EOD) work report and view previous submissions."
      />

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(66, 165, 245, 0.15), rgba(66, 165, 245, 0.05))",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "16px",
              p: 3,
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: "rgba(66, 165, 245, 0.2)",
                }}
              >
                <CalendarToday sx={{ fontSize: 28, color: "#42A5F5" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 13 }}>
                  Today's Reports
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>
                  {formatNumber(stats.todayReports)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(67, 160, 71, 0.15), rgba(67, 160, 71, 0.05))",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "16px",
              p: 3,
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: "rgba(67, 160, 71, 0.2)",
                }}
              >
                <Assignment sx={{ fontSize: 28, color: "#43A047" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 13 }}>
                  Total Reports
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>
                  {formatNumber(stats.totalReports)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(255, 152, 0, 0.15), rgba(255, 152, 0, 0.05))",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "16px",
              p: 3,
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: "rgba(255, 152, 0, 0.2)",
                }}
              >
                <Description sx={{ fontSize: 28, color: "#FF9800" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 13 }}>
                  Total Words
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>
                  {formatNumber(stats.totalWords)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(156, 39, 176, 0.15), rgba(156, 39, 176, 0.05))",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "16px",
              p: 3,
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: "rgba(156, 39, 176, 0.2)",
                }}
              >
                <TrendingUp sx={{ fontSize: 28, color: "#9C27B0" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 13 }}>
                  Current Month
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>
                  {formatNumber(stats.currentMonthReports)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* EOD Submission Form */}
      <GlassContainer sx={{ mb: 3 }}>
        <Typography
          sx={{
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
            mb: 3,
          }}
        >
          {isEditMode ? "Edit EOD" : "Submit EOD"}
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={(newValue) => handleFormChange("date", newValue)}
                sx={{
                  width: "100%",
                  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.18)" },
                  },
                }}
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ mb: 1 }}>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 14, mb: 1 }}>
                  Tasks
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleOpenTaskDialog}
                  sx={{
                    width: "100%",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "rgba(255, 255, 255, 0.9)",
                    py: 1.5,
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {formData.taskIds.length === 0
                    ? "Select Tasks"
                    : `${formData.taskIds.length} Task${formData.taskIds.length === 1 ? "" : "s"} Selected`}
                </Button>
                {formData.taskIds.length > 0 && (
                  <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {allTasks
                      .filter((task) => formData.taskIds.includes(task._id))
                      .map((task) => (
                        <Chip
                          key={task._id}
                          label={`${task.studentName} - ${task.moduleCode}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(67, 160, 71, 0.2)",
                            color: "#43A047",
                            fontWeight: 600,
                            fontSize: 11,
                          }}
                        />
                      ))}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ mb: 1 }}>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 14, mb: 1 }}>
                  Types of Work
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleOpenWorkTypeDialog}
                  sx={{
                    width: "100%",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "rgba(255, 255, 255, 0.9)",
                    py: 1.5,
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {formData.typesOfWork.length === 0
                    ? "Select Types of Work"
                    : `${formData.typesOfWork.length} Type${formData.typesOfWork.length === 1 ? "" : "s"} Selected`}
                </Button>
                {formData.typesOfWork.length > 0 && (
                  <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {formData.typesOfWork.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        size="small"
                        sx={{
                          bgcolor: "rgba(66, 165, 245, 0.2)",
                          color: "#42A5F5",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Word Count"
                type="number"
                value={formData.wordCount}
                onChange={(e) => handleFormChange("wordCount", e.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 1 }}
                sx={{
                  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.18)" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Received From"
                value="Team Lead"
                fullWidth
                size="small"
                disabled
                sx={{
                  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.18)" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Submitted To"
                value="Team Lead"
                fullWidth
                size="small"
                disabled
                sx={{
                  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.18)" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Work Summary"
                multiline
                rows={3}
                value={formData.summary}
                onChange={(e) => handleFormChange("summary", e.target.value)}
                fullWidth
                size="small"
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.summary.length}/500 characters`}
                sx={{
                  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.18)" },
                  },
                  "& .MuiFormHelperText-root": { color: "rgba(255, 255, 255, 0.5)" },
                }}
              />
            </Grid>


            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || loading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: 15,
                    background: "linear-gradient(135deg, #43A047, #2E7D32)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
                    },
                  }}
                >
                  {submitting ? "Submitting..." : isEditMode ? "Update EOD" : "Submit EOD"}
                </Button>
                {isEditMode && (
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    disabled={submitting}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: 15,
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "rgba(255, 255, 255, 0.9)",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </GlassContainer>

      {/* EOD History */}
      <GlassContainer>
        <Typography
          sx={{
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
            mb: 3,
          }}
        >
          EOD History
        </Typography>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "12px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Task(s)</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Type(s) of Work</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Word Count</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Received From</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Submitted To</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Summary</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Submitted Time</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ color: "rgba(255, 255, 255, 0.5)", py: 4 }}>
                      No EOD reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedReports.map((report) => (
                    <TableRow
                      key={report._id}
                      sx={{
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
                      }}
                    >
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        {formatDate(report.date)}
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {report.taskIds?.map((task) => (
                            <Chip
                              key={task._id}
                              label={`${task.studentName} - ${task.moduleCode}`}
                              size="small"
                              sx={{
                                bgcolor: "rgba(66, 165, 245, 0.2)",
                                color: "#42A5F5",
                                fontWeight: 600,
                                fontSize: 11,
                              }}
                            />
                          )) || "--"}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {report.typesOfWork?.map((type) => (
                            <Chip
                              key={type}
                              label={type}
                              size="small"
                              sx={{
                                bgcolor: "rgba(67, 160, 71, 0.2)",
                                color: "#43A047",
                                fontWeight: 600,
                              }}
                            />
                          )) || "--"}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        {formatNumber(report.wordCount)}
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        {report.receivedFrom || "--"}
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        {report.submittedTo || "--"}
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        {report.summary?.substring(0, 50) || "--"}
                        {report.summary?.length > 50 ? "..." : ""}
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        {formatDateTime(report.submittedAt)}
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        <IconButton
                          onClick={() => handleEdit(report)}
                          sx={{
                            color: "#42A5F5",
                            "&:hover": {
                              bgcolor: "rgba(66, 165, 245, 0.2)",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </GlassContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Task Selection Dialog */}
      <Dialog
        open={taskDialogOpen}
        onClose={handleCloseTaskDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(18, 28, 55, 0.96)",
            backdropFilter: "blur(18px)",
            borderRadius: "18px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#fff",
          },
        }}
        TransitionProps={{
          onEnter: () => {
            const dialog = document.querySelector('.MuiDialog-root .MuiPaper-root');
            if (dialog) {
              dialog.style.transform = 'scale(0.95)';
              dialog.style.opacity = '0';
              setTimeout(() => {
                dialog.style.transition = 'all 0.3s ease-out';
                dialog.style.transform = 'scale(1)';
                dialog.style.opacity = '1';
              }, 10);
            }
          },
          onExiting: () => {
            const dialog = document.querySelector('.MuiDialog-root .MuiPaper-root');
            if (dialog) {
              dialog.style.transition = 'all 0.2s ease-in';
              dialog.style.transform = 'scale(0.95)';
              dialog.style.opacity = '0';
            }
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "rgba(18, 28, 55, 0.95)",
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
            pb: 2,
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          Select Tasks
          <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 13, mt: 0.5, fontWeight: 400 }}>
            Choose tasks from your assignments
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            background: "rgba(18, 28, 55, 0.96)",
            color: "#fff",
            p: 3,
          }}
        >
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                placeholder="Search tasks..."
                value={taskFilters.search}
                onChange={(e) => handleTaskFilterChange("search", e.target.value)}
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.25)" },
                    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                  "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.6)" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Filter by Date"
                  value={taskFilters.date}
                  onChange={(newValue) => handleTaskFilterChange("date", newValue)}
                  sx={{
                    width: "100%",
                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.25)" },
                      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                    },
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Status"
                value={taskFilters.status}
                onChange={(e) => handleTaskFilterChange("status", e.target.value)}
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.25)" },
                    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                  },
                  "& .MuiSelect-select": { color: "#fff" },
                  "& .MuiMenu-paper": {
                    background: "rgba(18, 28, 55, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                {taskStatusOptions.map((option) => (
                  <MenuItem key={option} value={option} sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(0, 120, 255, 0.15)" } }}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box
            sx={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              maxHeight: 400,
              overflow: "auto",
              color: "#fff",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.3)",
                },
              },
            }}
          >
            <Table stickyHeader sx={{ background: "transparent" }}>
              <TableHead sx={{ background: "rgba(255, 255, 255, 0.08)" }}>
                <TableRow sx={{ bgcolor: "rgba(255, 255, 255, 0.08)" }}>
                  <TableCell padding="checkbox" sx={{ color: "#fff", fontWeight: 700, borderBottom: "1px solid rgba(255, 255, 255, 0.12)", background: "transparent" }}>
                    <Checkbox
                      checked={tempSelectedTasks.length === allTasks.length && allTasks.length > 0}
                      indeterminate={tempSelectedTasks.length > 0 && tempSelectedTasks.length < allTasks.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTempSelectedTasks(allTasks.map((t) => t._id));
                        } else {
                          setTempSelectedTasks([]);
                        }
                      }}
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        "&.Mui-checked": { color: "#43A047" },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "1px solid rgba(255, 255, 255, 0.12)", background: "transparent" }}>Student Name</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "1px solid rgba(255, 255, 255, 0.12)", background: "transparent" }}>Module</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "1px solid rgba(255, 255, 255, 0.12)", background: "transparent" }}>University</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "1px solid rgba(255, 255, 255, 0.12)", background: "transparent" }}>Assigned Date</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "1px solid rgba(255, 255, 255, 0.12)", background: "transparent" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ background: "transparent" }}>
                {allTasks.length === 0 ? (
                  <TableRow sx={{ background: "transparent" }}>
                    <TableCell colSpan={6} align="center" sx={{ color: "rgba(255, 255, 255, 0.5)", py: 4, background: "transparent" }}>
                      No tasks found.
                    </TableCell>
                  </TableRow>
                ) : (
                  allTasks.map((task, index) => (
                    <TableRow
                      key={task._id}
                      sx={{
                        bgcolor: index % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.05)",
                        "&:hover": { bgcolor: "rgba(0, 120, 255, 0.15)" },
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "transparent" }}>
                        <Checkbox
                          checked={tempSelectedTasks.includes(task._id)}
                          onChange={() => handleTempTaskToggle(task._id)}
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            "&.Mui-checked": { color: "#43A047" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "transparent" }}>
                        {task.studentName || "--"}
                      </TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "transparent" }}>
                        {task.moduleCode || "--"}
                      </TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "transparent" }}>
                        {task.university || "--"}
                      </TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "transparent" }}>
                        {formatDate(task.assignedAt)}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "transparent" }}>
                        <Chip
                          label={task.status || "--"}
                          size="small"
                          sx={{
                            bgcolor: "rgba(66, 165, 245, 0.2)",
                            color: "#42A5F5",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(255, 255, 255, 0.12)", background: "rgba(18, 28, 55, 0.96)" }}>
          <Button
            onClick={handleCloseTaskDialog}
            variant="outlined"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": { 
                borderColor: "rgba(255, 255, 255, 0.5)",
                bgcolor: "rgba(255, 255, 255, 0.1)" 
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveTasks}
            sx={{
              background: "linear-gradient(135deg, #43A047, #2E7D32)",
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
              },
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Work Type Selection Dialog */}
      <Dialog
        open={workTypeDialogOpen}
        onClose={handleCloseWorkTypeDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(18, 28, 55, 0.96)",
            backdropFilter: "blur(18px)",
            borderRadius: "18px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#fff",
          },
        }}
        TransitionProps={{
          onEnter: () => {
            const dialog = document.querySelector('.MuiDialog-root .MuiPaper-root');
            if (dialog) {
              dialog.style.transform = 'scale(0.95)';
              dialog.style.opacity = '0';
              setTimeout(() => {
                dialog.style.transition = 'all 0.3s ease-out';
                dialog.style.transform = 'scale(1)';
                dialog.style.opacity = '1';
              }, 10);
            }
          },
          onExiting: () => {
            const dialog = document.querySelector('.MuiDialog-root .MuiPaper-root');
            if (dialog) {
              dialog.style.transition = 'all 0.2s ease-in';
              dialog.style.transform = 'scale(0.95)';
              dialog.style.opacity = '0';
            }
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "rgba(18, 28, 55, 0.95)",
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
            pb: 2,
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          Select Types of Work
          <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 13, mt: 0.5, fontWeight: 400 }}>
            Choose the types of work you performed
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            background: "rgba(18, 28, 55, 0.96)",
            color: "#fff",
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              p: 2,
              background: "transparent",
              color: "#fff",
            }}
          >
            {typeOfWorkOptions.map((option) => (
              <Chip
                key={option}
                label={option}
                onClick={() => handleTempWorkTypeToggle(option)}
                sx={{
                  bgcolor: tempSelectedWorkTypes.includes(option)
                    ? "#1976d2"
                    : "rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  border: tempSelectedWorkTypes.includes(option)
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.15)",
                  cursor: "pointer",
                  px: 1,
                  py: 2,
                  fontSize: 14,
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: tempSelectedWorkTypes.includes(option)
                      ? "#1976d2"
                      : "rgba(0, 120, 255, 0.15)",
                  },
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(255, 255, 255, 0.12)", background: "rgba(18, 28, 55, 0.96)" }}>
          <Button
            onClick={handleCloseWorkTypeDialog}
            variant="outlined"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": { 
                borderColor: "rgba(255, 255, 255, 0.5)",
                bgcolor: "rgba(255, 255, 255, 0.1)" 
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveWorkTypes}
            sx={{
              background: "linear-gradient(135deg, #43A047, #2E7D32)",
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </EmployeeLayout>
  );
};

export default EmployeeDailyReports;
