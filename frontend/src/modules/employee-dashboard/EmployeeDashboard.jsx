import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  CircularProgress
} from "@mui/material";

import {
  Assignment,
  Pending,
  CheckCircle,
  Refresh,
  Work,
  FolderOpen,
  RateReview,
  Chat,
  ArrowForward,
  TaskAlt
} from "@mui/icons-material";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import EmployeeLayout from "../../layouts/EmployeeLayout";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/layout/StatCard";
import GlassContainer from "../../components/layout/GlassContainer";

import axiosInstance from "../../services/axiosInstance";
import socketService from "../../services/socket";

const EmployeeDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalAssignedTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    reworkTasks: 0,
    approvedSolutions: 0,
    totalEODSubmitted: 0,
    totalWorkCount: 0,
    todayWorkCount: 0,
    weeklyWorkCount: 0,
    monthlyWorkCount: 0,
    todayHours: 0,
    weeklyHours: 0,
    monthlyHours: 0,
    taskStatus: { assigned: 0, progress: 0, approved: 0, rework: 0 },
    workTypeDistribution: {}
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentWorks, setRecentWorks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get("/dashboard/employee");
      setDashboard(response.data || {});
    } catch (error) {
      console.log("[EmployeeDashboard] Error fetching dashboard:", error);
    }
  };

  const fetchRecentTasks = async () => {
    try {
      const response = await axiosInstance.get("/dashboard/recent-tasks");
      setRecentTasks(response.data || []);
    } catch (error) {
      console.log("[EmployeeDashboard] Error fetching recent tasks:", error);
      setRecentTasks([]);
    }
  };

  const fetchRecentWorks = async () => {
    try {
      const response = await axiosInstance.get("/dashboard/recent-works");
      setRecentWorks(response.data || []);
    } catch (error) {
      console.log("[EmployeeDashboard] Error fetching recent works:", error);
      setRecentWorks([]);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await axiosInstance.get("/dashboard/recent-activity");
      setRecentActivity(response.data || []);
    } catch (error) {
      console.log("[EmployeeDashboard] Error fetching recent activity:", error);
      setRecentActivity([]);
    }
  };

  useEffect(() => {
    // Optimize API calls with Promise.all
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDashboard(),
          fetchRecentTasks(),
          fetchRecentWorks(),
          fetchRecentActivity()
        ]);
      } catch (error) {
        console.log("[EmployeeDashboard] Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Socket.IO event listeners for real-time updates
    const socket = socketService.getSocket();
    if (socket) {
      const handleTaskAssigned = (data) => {
        console.log("[EmployeeDashboard] Task assigned:", data);
        fetchDashboard();
        fetchRecentTasks();
        fetchRecentActivity();
      };

      const handleTaskUpdated = (data) => {
        console.log("[EmployeeDashboard] Task updated:", data);
        fetchDashboard();
        fetchRecentTasks();
      };

      const handleSolutionSubmitted = (data) => {
        console.log("[EmployeeDashboard] Solution submitted:", data);
        fetchDashboard();
        fetchRecentActivity();
      };

      const handleSolutionApproved = (data) => {
        console.log("[EmployeeDashboard] Solution approved:", data);
        fetchDashboard();
        fetchRecentWorks();
        fetchRecentActivity();
      };

      const handleSolutionRework = (data) => {
        console.log("[EmployeeDashboard] Solution rework:", data);
        fetchDashboard();
        fetchRecentActivity();
      };

      const handleEODSubmitted = (data) => {
        console.log("[EmployeeDashboard] EOD submitted:", data);
        fetchDashboard();
        fetchRecentActivity();
      };

      const handleNotificationCreated = (data) => {
        console.log("[EmployeeDashboard] Notification created:", data);
        fetchDashboard();
        fetchRecentActivity();
      };

      socket.on("taskAssigned", handleTaskAssigned);
      socket.on("taskUpdated", handleTaskUpdated);
      socket.on("solutionSubmitted", handleSolutionSubmitted);
      socket.on("solutionApproved", handleSolutionApproved);
      socket.on("solutionRework", handleSolutionRework);
      socket.on("eodSubmitted", handleEODSubmitted);
      socket.on("notificationCreated", handleNotificationCreated);

      return () => {
        socket.off("taskAssigned", handleTaskAssigned);
        socket.off("taskUpdated", handleTaskUpdated);
        socket.off("solutionSubmitted", handleSolutionSubmitted);
        socket.off("solutionApproved", handleSolutionApproved);
        socket.off("solutionRework", handleSolutionRework);
        socket.off("eodSubmitted", handleEODSubmitted);
        socket.off("notificationCreated", handleNotificationCreated);
      };
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "ASSIGNED":
        return { backgroundColor: "rgba(25,118,210,0.2)", color: "#1976D2" };
      case "PROGRESS":
        return { backgroundColor: "rgba(245,127,23,0.2)", color: "#F57C00" };
      case "APPROVED":
        return { backgroundColor: "rgba(46,125,50,0.2)", color: "#2E7D32" };
      case "REWORK":
        return { backgroundColor: "rgba(198,40,40,0.2)", color: "#C62828" };
      default:
        return { backgroundColor: "rgba(158,158,158,0.2)", color: "#9E9E9E" };
    }
  };

  const getActivityIcon = (iconName) => {
    switch (iconName) {
      case "Assignment":
        return <Assignment />;
      case "CheckCircle":
        return <CheckCircle />;
      case "Refresh":
        return <Refresh />;
      case "Send":
        return <ArrowForward />;
      default:
        return <TaskAlt />;
    }
  };

  const getWorkTypeColor = (type) => {
    const colors = {
      "Assignment": "#1976D2",
      "Paraphrasing": "#9C27B0",
      "Research": "#2E7D32",
      "Presentation": "#F57C00",
      "Report": "#1565C0",
      "Dissertation": "#7B1FA2",
      "Editing": "#00695C",
      "Formatting": "#EF6C00",
      "Referencing": "#4527A0",
      "Report Writing": "#0277BD",
      "Literature Review": "#6A1B9A",
      "Other": "#757575"
    };
    return colors[type] || "#757575";
  };

  const generatePieChartGradient = (distribution) => {
    if (!distribution || typeof distribution !== 'object') {
      return "conic-gradient(#E0E0E0 0deg 360deg)";
    }
    
    const entries = Object.entries(distribution || {});
    if (entries.length === 0) return "conic-gradient(#E0E0E0 0deg 360deg)";
    
    const total = entries.reduce((sum, [, count]) => sum + (count || 0), 0);
    if (total === 0) return "conic-gradient(#E0E0E0 0deg 360deg)";
    
    let currentDegree = 0;
    const gradients = entries.map(([type, count]) => {
      const percentage = ((count || 0) / total) * 360;
      const startDegree = currentDegree;
      const endDegree = currentDegree + percentage;
      currentDegree = endDegree;
      return `${getWorkTypeColor(type)} ${startDegree}deg ${endDegree}deg`;
    });
    
    return `conic-gradient(${gradients.join(", ")})`;
  };

  return (
    <EmployeeLayout>
      <PageHeader
        title="Dashboard"
        subtitle="View your work summary and activity."
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
      {/* Statistics Cards - Row 1 */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Assigned"
            value={dashboard.totalAssignedTasks ?? 0}
            icon={<Assignment sx={{ fontSize: 28 }} />}
            color="#1976D2"
            gradient="linear-gradient(135deg, #1976D2, #42A5F5)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="In Progress"
            value={dashboard.inProgressTasks ?? 0}
            icon={<Pending sx={{ fontSize: 28 }} />}
            color="#F57C00"
            gradient="linear-gradient(135deg, #F57C00, #FF9800)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Completed"
            value={dashboard.completedTasks ?? 0}
            icon={<CheckCircle sx={{ fontSize: 28 }} />}
            color="#2E7D32"
            gradient="linear-gradient(135deg, #2E7D32, #4CAF50)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Pending"
            value={dashboard.pendingTasks ?? 0}
            icon={<Pending sx={{ fontSize: 28 }} />}
            color="#1565C0"
            gradient="linear-gradient(135deg, #1565C0, #2196F3)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Rework"
            value={dashboard.reworkTasks ?? 0}
            icon={<Refresh sx={{ fontSize: 28 }} />}
            color="#C62828"
            gradient="linear-gradient(135deg, #C62828, #F44336)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Approved Solutions"
            value={dashboard.approvedSolutions ?? 0}
            icon={<CheckCircle sx={{ fontSize: 28 }} />}
            color="#7B1FA2"
            gradient="linear-gradient(135deg, #7B1FA2, #9C27B0)"
          />
        </Grid>
      </Grid>


      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, rgba(25,118,210,0.25), rgba(66,165,245,0.18))",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(25,118,210,0.45)",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 30px rgba(25,118,210,0.4)",
              },
            }}
            onClick={() => navigate("/employee/eod")}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Assignment sx={{ fontSize: 40, color: "#1565C0", mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} color="#1565C0">
                Submit EOD
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(21, 101, 192, 0.85)", fontWeight: 500 }}>
                Submit daily report
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, rgba(245,127,23,0.25), rgba(255,152,0,0.18))",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(245,127,23,0.45)",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 30px rgba(245,127,23,0.4)",
              },
            }}
            onClick={() => navigate("/employee/assigned-work")}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Assignment sx={{ fontSize: 40, color: "#E65100", mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} color="#E65100">
                View Tasks
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(230, 81, 0, 0.85)", fontWeight: 500 }}>
                View assigned tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, rgba(156,39,176,0.25), rgba(156,39,176,0.18))",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(156,39,176,0.45)",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 30px rgba(156,39,176,0.4)",
              },
            }}
            onClick={() => navigate("/employee/team-chat")}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Chat sx={{ fontSize: 40, color: "#7B1FA2", mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} color="#7B1FA2">
                Team Chat
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(123, 31, 162, 0.85)", fontWeight: 500 }}>
                Chat with your team
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, rgba(21,101,192,0.25), rgba(33,150,243,0.18))",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(21,101,192,0.45)",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 30px rgba(21,101,192,0.4)",
              },
            }}
            onClick={() => navigate("/employee/notifications")}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <RateReview sx={{ fontSize: 40, color: "#0D47A1", mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} color="#0D47A1">
                Notifications
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(13, 71, 161, 0.85)", fontWeight: 500 }}>
                View notifications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, rgba(46,125,50,0.25), rgba(76,175,80,0.18))",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(46,125,50,0.45)",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 30px rgba(46,125,50,0.4)",
              },
            }}
            onClick={() => navigate("/employee/profile")}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <TaskAlt sx={{ fontSize: 40, color: "#2E7D32", mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} color="#2E7D32">
                Profile
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(46, 125, 50, 0.85)", fontWeight: 500 }}>
                View your profile
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <GlassContainer>
            <Typography variant="h6" fontWeight={700} mb={3} color="#0f172a">
              Task Status Overview
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(25,118,210,0.3)" }}>
                  <Box sx={{ width: `${(dashboard.taskStatus?.assigned || 0) / ((dashboard.taskStatus?.assigned || 0) + (dashboard.taskStatus?.progress || 0) + (dashboard.taskStatus?.approved || 0) + (dashboard.taskStatus?.rework || 0) || 1) * 100}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #1976D2, #42A5F5)" }} />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: "#1e293b" }}>Assigned ({dashboard.taskStatus?.assigned || 0})</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(245,127,23,0.3)" }}>
                  <Box sx={{ width: `${(dashboard.taskStatus?.progress || 0) / ((dashboard.taskStatus?.assigned || 0) + (dashboard.taskStatus?.progress || 0) + (dashboard.taskStatus?.approved || 0) + (dashboard.taskStatus?.rework || 0) || 1) * 100}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #F57C00, #FF9800)" }} />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: "#1e293b" }}>In Progress ({dashboard.taskStatus?.progress || 0})</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(46,125,50,0.3)" }}>
                  <Box sx={{ width: `${(dashboard.taskStatus?.approved || 0) / ((dashboard.taskStatus?.assigned || 0) + (dashboard.taskStatus?.progress || 0) + (dashboard.taskStatus?.approved || 0) + (dashboard.taskStatus?.rework || 0) || 1) * 100}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #2E7D32, #4CAF50)" }} />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: "#1e293b" }}>Approved ({dashboard.taskStatus?.approved || 0})</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(198,40,40,0.3)" }}>
                  <Box sx={{ width: `${(dashboard.taskStatus?.rework || 0) / ((dashboard.taskStatus?.assigned || 0) + (dashboard.taskStatus?.progress || 0) + (dashboard.taskStatus?.approved || 0) + (dashboard.taskStatus?.rework || 0) || 1) * 100}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #C62828, #F44336)" }} />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: "#1e293b" }}>Rework ({dashboard.taskStatus?.rework || 0})</Typography>
              </Box>
            </Box>
          </GlassContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <GlassContainer>
            <Typography variant="h6" fontWeight={700} mb={3} color="#0f172a">
              Work Type Distribution
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <Box sx={{ position: "relative", width: 160, height: 160 }}>
                <Box sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: generatePieChartGradient(dashboard.workTypeDistribution),
                }} />
                <Box sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.95)",
                }} />
                <Box sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}>
                  <Typography variant="h6" fontWeight={700} color="#0f172a">
                    {Object.values(dashboard.workTypeDistribution || {}).reduce((a, b) => a + (b || 0), 0)}
                  </Typography>
                  <Typography variant="caption" color="rgba(15, 23, 42, 0.8)">
                    Total
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2, flexWrap: "wrap" }}>
              {Object.entries(dashboard.workTypeDistribution || {}).map(([type, count], index) => (
                <Box key={type} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 2, background: getWorkTypeColor(type) }} />
                  <Typography variant="caption" sx={{ color: "#1e293b", fontWeight: 600 }}>{type} ({count || 0})</Typography>
                </Box>
              ))}
              {Object.keys(dashboard.workTypeDistribution || {}).length === 0 && (
                <Typography variant="caption" sx={{ color: "#1e293b" }}>No work data yet</Typography>
              )}
            </Box>
          </GlassContainer>
        </Grid>
      </Grid>

      {/* Recent Assigned Tasks */}
      <GlassContainer sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={3} color="#0f172a">
          Recent Assigned Tasks
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(25,118,210,0.2)" }}>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>University</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>Module Code</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>Assigned Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTasks.map((task, index) => (
                <TableRow
                  key={task._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)",
                    "&:hover": { backgroundColor: "rgba(25,118,210,0.15)", cursor: "pointer" },
                  }}
                  onClick={() => navigate("/employee/assigned-work")}
                >
                  <TableCell sx={{ color: "#1e293b" }}>{task.studentName}</TableCell>
                  <TableCell sx={{ color: "#1e293b" }}>{task.university}</TableCell>
                  <TableCell sx={{ color: "#1e293b" }}>{task.moduleCode}</TableCell>
                  <TableCell sx={{ color: "#1e293b" }}>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      size="small"
                      sx={getStatusColor(task.status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {recentTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No assigned tasks
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassContainer>

      {/* Recent Completed Works */}
      <GlassContainer sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={3} color="#0f172a">
          Recent Completed Works
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(25,118,210,0.2)" }}>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>Module Code</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>Solution Type</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>Approved Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentWorks.map((work, index) => (
                <TableRow
                  key={work._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)",
                  }}
                >
                  <TableCell sx={{ color: "#1e293b" }}>{work.taskId?.studentName || "N/A"}</TableCell>
                  <TableCell sx={{ color: "#1e293b" }}>{work.taskId?.moduleCode || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={work.solutionType}
                      size="small"
                      sx={{
                        backgroundColor: work.solutionType === "FINAL" ? "rgba(25,118,210,0.2)" : "rgba(156,39,176,0.2)",
                        color: work.solutionType === "FINAL" ? "#1976D2" : "#9C27B0",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{new Date(work.reviewedAt || work.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {recentWorks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No completed works
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassContainer>

      {/* Recent Activity */}
      <GlassContainer>
        <Typography variant="h6" fontWeight={700} mb={3} color="#0f172a">
          Recent Activity
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {recentActivity.map((activity, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.45)",
              }}
            >
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1976D2, #42A5F5)",
                color: "#fff",
              }}>
                {getActivityIcon(activity.icon)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600} color="#0f172a">
                  {activity.type}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(15, 23, 42, 0.8)", fontWeight: 500 }}>
                  {activity.title}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "rgba(15, 23, 42, 0.65)", fontWeight: 500 }}>
                {new Date(activity.date).toLocaleString()}
              </Typography>
            </Box>
          ))}
          {recentActivity.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              No recent activity
            </Typography>
          )}
        </Box>
      </GlassContainer>
        </>
      )}
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
