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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Badge,
  Link,
  Stack,
  Chip,
  Card,
  CardContent
} from "@mui/material";

import {
  AttachFile,
  Send,
  Groups,
  Assignment,
  Pending,
  CheckCircle,
  Refresh,
  Notifications,
  Work,
  FolderOpen,
  RateReview,
  Chat,
  ArrowForward
} from "@mui/icons-material";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../../components/layout/StatCard";
import GlassContainer from "../../components/layout/GlassContainer";
import DashboardHeader from "../../components/layout/DashboardHeader";

import axiosInstance from "../../services/axiosInstance";
import socketService from "../../services/socket";

const menuItems = [
  { label: "Dashboard" },
  { label: "Employees" },
  { label: "Tasks" },
  { label: "Reviews" },
  { label: "Solutions" },
  { label: "Reports" },
  { label: "Notifications" }
];

const TeamLeadDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    pendingReviews: 0,
    approvedTasks: 0,
    reworkTasks: 0,
    solutionsCount: 0
  });
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [openSolutionDialog, setOpenSolutionDialog] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [solutionDialogLoading, setSolutionDialogLoading] = useState(false);
  const chatEndRef = useRef(null);

  const navigate = useNavigate();

  const currentUser = useRef(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  ).current;

  const normalizeFilePath = (filePath) =>
    String(filePath).replace(/\\/g, "/").replace(/^\//, "");

  const getAttachmentUrl = (filePath) => {
    if (!filePath) return "";
    const normalized = normalizeFilePath(filePath);
    const baseUrl = axiosInstance.defaults.baseURL?.replace(/\/api$/, "") || "http://localhost:5000";
    return normalized.startsWith("http") ? normalized : `${baseUrl}/${normalized}`;
  };

  const isImageFile = (fileName) => {
    const ext = String(fileName).split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif"].includes(ext);
  };

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get("/dashboard/teamlead");
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingEmployees = async () => {
    try {
      const response = await axiosInstance.get("/employees/pending");
      setPendingEmployees(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchSolutionForTask =
  async (taskId) => {
    try {
      const response =
        await axiosInstance.get(
          `/solutions/task/${taskId}`
        );
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleOpenSolutionDialog =
  async (task) => {
    if (!task) return;
    setSelectedTask(task);
    setSolutionDialogLoading(true);

    const solution =
      await fetchSolutionForTask(task._id);

    setSolutionDialogLoading(false);

    if (!solution) {
      alert(
        "No solution details available for this task."
      );
      return;
    }

    setSelectedSolution(solution);
    setOpenSolutionDialog(true);
  };

  const fetchTaskUnreadCounts = async (currentTasks) => {
    if (!currentUser) return;

    const counts = {};

    await Promise.all(
      currentTasks.map(async (task) => {
        try {
          const response = await axiosInstance.get(`/task-chat/${task._id}?markRead=false`);
          const unread = (response.data || []).filter((message) => {
            const receiverId = message.receiverId?._id || message.receiverId;
            return String(receiverId) === String(currentUser._id) && message.isRead === false;
          }).length;

          if (unread > 0) {
            counts[task._id] = unread;
          }
        } catch (error) {
          console.log(error);
        }
      })
    );

    setUnreadCounts(counts);
  };

 useEffect(() => {

  fetchDashboard();
  fetchPendingEmployees();
  fetchTasks();

  // Socket.IO event listeners for real-time updates
  const socket = socketService.getSocket();
  if (socket) {
    const handleTaskAssigned = (data) => {
      console.log("[TeamLeadDashboard] New task assigned:", data);
      fetchDashboard();
      fetchTasks();
    };

    const handleTaskUpdated = (data) => {
      console.log("[TeamLeadDashboard] Task updated:", data);
      fetchDashboard();
      fetchTasks();
    };

    const handleSolutionSubmitted = (data) => {
      console.log("[TeamLeadDashboard] Solution submitted:", data);
      fetchDashboard();
    };

    socket.on("taskAssigned", handleTaskAssigned);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("solutionSubmitted", handleSolutionSubmitted);

    return () => {
      socket.off("taskAssigned", handleTaskAssigned);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("solutionSubmitted", handleSolutionSubmitted);
    };
  }

}, []);

  useEffect(() => {
    if (tasks.length > 0 && currentUser) {
      fetchTaskUnreadCounts(tasks);
    }
  }, [tasks, currentUser]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const approveEmployee = async (id) => {
    try {
      await axiosInstance.put(`/employees/${id}/approve`);
      fetchPendingEmployees();
      fetchDashboard();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectEmployee = async (id) => {
    try {
      await axiosInstance.put(`/employees/${id}/reject`);
      fetchPendingEmployees();
      fetchDashboard();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseSolutionDialog = () => {
    setOpenSolutionDialog(false);
    setSelectedSolution(null);
    setSelectedTask(null);
  };

  const approveSolution =
  async (solutionId) => {

    try {

      await axiosInstance.put(
        `/solutions/${solutionId}/approve`
      );

      fetchTasks();
      fetchDashboard();
      handleCloseSolutionDialog();

      alert(
        "Solution Approved"
      );

    } catch (error) {

      console.log(error);

    }

  };

  const reworkSolution =
  async (solutionId) => {

    try {

      await axiosInstance.put(
        `/solutions/${solutionId}/rework`
      );

      fetchTasks();
      fetchDashboard();
      handleCloseSolutionDialog();

      alert(
        "Rework Sent"
      );

    } catch (error) {

      console.log(error);

    }

  };

  const handleOpenChat = async (task) => {
    setSelectedTask(task);
    setOpenChatDialog(true);
    await fetchChatMessages(task._id);
    await fetchTaskUnreadCounts(tasks);
  };

  const renderFilePreview = (filePath, index) => {
    const url = getAttachmentUrl(filePath);
    const fileName = String(filePath).split("/").pop();
    const lower = fileName.toLowerCase();

    if (isImageFile(fileName)) {
      return (
        <Box key={index} sx={{ mt: 1 }}>
          <Box
            component="img"
            src={url}
            alt={fileName}
            sx={{ width: 200, maxHeight: 150, objectFit: "cover", borderRadius: 2, display: "block" }}
          />
          <Link href={url} target="_blank" rel="noreferrer" underline="hover">
            {fileName}
          </Link>
        </Box>
      );
    }

    if (lower.endsWith(".pdf")) {
      return (
        <Box key={index} sx={{ mt: 1, p: 1, border: "1px solid #E0E0E0", borderRadius: 2, backgroundColor: "#F7F7F7" }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {fileName}
          </Typography>
          <Link href={url} target="_blank" rel="noreferrer" underline="hover">
            Preview PDF
          </Link>
        </Box>
      );
    }

    return (
      <Box key={index} sx={{ mt: 1, p: 1, border: "1px solid #E0E0E0", borderRadius: 2, backgroundColor: "#F7F7F7" }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {fileName}
        </Typography>
        <Link href={url} target="_blank" rel="noreferrer" underline="hover">
          Download
        </Link>
      </Box>
    );
  };

  const handleCloseChat = () => {
    setOpenChatDialog(false);
    setSelectedTask(null);
    setChatMessages([]);
    setChatMessage("");
    setSelectedFiles([]);
  };

  const fetchChatMessages = async (taskId) => {
    if (!taskId) {
      setChatMessages([]);
      return;
    }

    try {
      const response = await axiosInstance.get(`/task-chat/${taskId}`);
      const sortedMessages = (response.data || []).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setChatMessages(sortedMessages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileSelection = (event) => {
    setSelectedFiles(Array.from(event.target.files || []));
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };

  const sendChatMessage = async () => {
    if (!selectedTask) return;

    if (!chatMessage.trim() && selectedFiles.length === 0) {
      alert("Please enter a message or attach files before sending.");
      return;
    }

    try {
      const receiverId = selectedTask.assignedTo?._id || selectedTask.assignedTo;
      if (!receiverId) {
        alert("Unable to determine the employee receiver ID.");
        return;
      }

      const formData = new FormData();
      formData.append("message", chatMessage.trim());
      formData.append("receiverId", receiverId);
      selectedFiles.forEach((file) => formData.append("files", file));

      await axiosInstance.post(`/task-chat/${selectedTask._id}`, formData);
      setChatMessage("");
      clearSelectedFiles();
      await fetchChatMessages(selectedTask._id);
      await fetchTaskUnreadCounts(tasks);
    } catch (error) {
      console.log(error);
    }
  };

  const renderMessageBubble = (chat) => {
    const senderId = chat.senderId?._id || chat.senderId;
    const isTeamLead = String(senderId) === String(currentUser?._id);
    const senderName = isTeamLead ? "You" : chat.senderId?.name || "Employee";

    return (
      <Box
        key={chat._id}
        sx={{
          display: "flex",
          justifyContent: isTeamLead ? "flex-end" : "flex-start",
          mb: 1
        }}
      >
        <Paper
          sx={{
            p: 2,
            maxWidth: "80%",
            backgroundColor: isTeamLead ? "#DCF8C6" : "#F1F0F0",
            borderRadius: 3,
            borderTopRightRadius: isTeamLead ? 0 : 16,
            borderTopLeftRadius: isTeamLead ? 16 : 0,
            boxShadow: "none"
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: "block" }}>
            {senderName}
          </Typography>
          {chat.message && (
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {chat.message}
            </Typography>
          )}
          {chat.files?.length > 0 && (
            <Box sx={{ mt: chat.message ? 1 : 0 }}>
              {chat.files.map((filePath, index) => renderFilePreview(filePath, index))}
            </Box>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", textAlign: "right" }}>
            {new Date(chat.createdAt).toLocaleString()}
          </Typography>
        </Paper>
      </Box>
    );
  };

  return (
    <>
      <DashboardHeader title="Team Lead Dashboard" />

      <Box sx={{ p: 4, background: "#F8FAFC", minHeight: "100vh" }}>

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard
              title="Total Employees"
              value={dashboard.totalEmployees}
              icon={<Groups sx={{ fontSize: 28 }} />}
              color="#1976D2"
              gradient="linear-gradient(135deg, #1976D2, #42A5F5)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard
              title="Total Assigned Tasks"
              value={dashboard.totalTasks}
              icon={<Assignment sx={{ fontSize: 28 }} />}
              color="#2E7D32"
              gradient="linear-gradient(135deg, #2E7D32, #4CAF50)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard
              title="Tasks In Progress"
              value={dashboard.pendingReviews}
              icon={<Pending sx={{ fontSize: 28 }} />}
              color="#F57C00"
              gradient="linear-gradient(135deg, #F57C00, #FF9800)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard
              title="Approved Solutions"
              value={dashboard.approvedTasks}
              icon={<CheckCircle sx={{ fontSize: 28 }} />}
              color="#1565C0"
              gradient="linear-gradient(135deg, #1565C0, #2196F3)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard
              title="Rework Solutions"
              value={dashboard.reworkTasks}
              icon={<Refresh sx={{ fontSize: 28 }} />}
              color="#C62828"
              gradient="linear-gradient(135deg, #C62828, #F44336)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard
              title="Pending Reviews"
              value={dashboard.solutionsCount}
              icon={<Notifications sx={{ fontSize: 28 }} />}
              color="#7B1FA2"
              gradient="linear-gradient(135deg, #7B1FA2, #9C27B0)"
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, rgba(25,118,210,0.15), rgba(66,165,245,0.1))",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(25,118,210,0.3)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 30px rgba(25,118,210,0.3)",
                },
              }}
              onClick={() => navigate("/teamlead/work-allocation")}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Work sx={{ fontSize: 40, color: "#1976D2", mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={700} color="#1976D2">
                  Assign Work
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, rgba(46,125,50,0.15), rgba(76,175,80,0.1))",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(46,125,50,0.3)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 30px rgba(46,125,50,0.3)",
                },
              }}
              onClick={() => navigate("/teamlead/employees")}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Groups sx={{ fontSize: 40, color: "#2E7D32", mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={700} color="#2E7D32">
                  Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, rgba(156,39,176,0.15), rgba(156,39,176,0.1))",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(156,39,176,0.3)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 30px rgba(156,39,176,0.3)",
                },
              }}
              onClick={() => navigate("/teamlead/solution-repository")}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <FolderOpen sx={{ fontSize: 40, color: "#9C27B0", mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={700} color="#9C27B0">
                  Solutions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, rgba(245,127,23,0.15), rgba(255,152,0,0.1))",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(245,127,23,0.3)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 30px rgba(245,127,23,0.3)",
                },
              }}
              onClick={() => navigate("/teamlead/solution-approvals")}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <RateReview sx={{ fontSize: 40, color: "#F57C00", mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={700} color="#F57C00">
                  Approvals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, rgba(21,101,192,0.15), rgba(33,150,243,0.1))",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(21,101,192,0.3)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 30px rgba(21,101,192,0.3)",
                },
              }}
              onClick={() => navigate("/teamlead/chat")}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Chat sx={{ fontSize: 40, color: "#1565C0", mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={700} color="#1565C0">
                  Team Chat
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, rgba(123,31,162,0.15), rgba(156,39,176,0.1))",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(123,31,162,0.3)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 30px rgba(123,31,162,0.3)",
                },
              }}
              onClick={() => navigate("/teamlead/notifications")}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Notifications sx={{ fontSize: 40, color: "#7B1FA2", mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={700} color="#7B1FA2">
                  Notifications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <GlassContainer>
              <Typography variant="h6" fontWeight={700} mb={3} color="#1a365d">
                Task Status Overview
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(25,118,210,0.2)" }}>
                    <Box sx={{ width: `${(dashboard.totalTasks > 0 ? (dashboard.totalTasks - dashboard.pendingReviews) / dashboard.totalTasks * 100 : 0)}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #1976D2, #42A5F5)" }} />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600 }}>Assigned</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(245,127,23,0.2)" }}>
                    <Box sx={{ width: `${(dashboard.totalTasks > 0 ? dashboard.pendingReviews / dashboard.totalTasks * 100 : 0)}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #F57C00, #FF9800)" }} />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600 }}>In Progress</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(46,125,50,0.2)" }}>
                    <Box sx={{ width: `${(dashboard.totalTasks > 0 ? dashboard.approvedTasks / dashboard.totalTasks * 100 : 0)}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #2E7D32, #4CAF50)" }} />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600 }}>Approved</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(198,40,40,0.2)" }}>
                    <Box sx={{ width: `${(dashboard.totalTasks > 0 ? dashboard.reworkTasks / dashboard.totalTasks * 100 : 0)}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #C62828, #F44336)" }} />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600 }}>Rework</Typography>
                </Box>
              </Box>
            </GlassContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <GlassContainer>
              <Typography variant="h6" fontWeight={700} mb={3} color="#1a365d">
                Solution Types
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <Box sx={{ position: "relative", width: 160, height: 160 }}>
                  <Box sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "conic-gradient(#1976D2 0deg 180deg, #9C27B0 180deg 270deg, #2E7D32 270deg 360deg)",
                  }} />
                  <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)",
                  }} />
                  <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}>
                    <Typography variant="h6" fontWeight={700} color="#1a365d">
                      {dashboard.approvedTasks + dashboard.reworkTasks}
                    </Typography>
                    <Typography variant="caption" color="rgba(26,54,93,0.7)">
                      Total
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 2, background: "#1976D2" }} />
                  <Typography variant="caption">FINAL</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 2, background: "#9C27B0" }} />
                  <Typography variant="caption">PARAPHRASE</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 2, background: "#2E7D32" }} />
                  <Typography variant="caption">OTHER</Typography>
                </Box>
              </Box>
            </GlassContainer>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <GlassContainer sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={700} mb={3} color="#1a365d">
            Recent Activity
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {tasks.slice(0, 5).map((task, index) => (
              <Box
                key={task._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
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
                }}>
                  <Assignment sx={{ fontSize: 20, color: "#fff" }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="#1a365d">
                    Task Assigned: {task.studentName}
                  </Typography>
                  <Typography variant="caption" color="rgba(26,54,93,0.7)">
                    {task.moduleCode} • {task.assignedTo?.name}
                  </Typography>
                </Box>
                <Typography variant="caption" color="rgba(26,54,93,0.5)">
                  {new Date(task.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
            {tasks.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                No recent activity
              </Typography>
            )}
          </Box>
        </GlassContainer>

        <GlassContainer sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={700} mb={3} color="#1a365d">
            Employee Approval Requests
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(25,118,210,0.1)" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Qualification</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingEmployees.map((employee, index) => (
                  <TableRow
                    key={employee._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)",
                      "&:hover": { backgroundColor: "rgba(25,118,210,0.1)" },
                    }}
                  >
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.qualification}</TableCell>
                    <TableCell>{employee.team}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.status}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(245,127,23,0.2)",
                          color: "#F57C00",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ mr: 1, borderRadius: 8 }}
                        onClick={() => approveEmployee(employee._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ borderRadius: 8 }}
                        onClick={() => rejectEmployee(employee._id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassContainer>

        <GlassContainer sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={700} mb={3} color="#1a365d">
            Recent Assigned Work
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(25,118,210,0.1)" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Assigned Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Messages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No Tasks Assigned Yet</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task, index) => {
                    const unread = unreadCounts[task._id] || 0;
                    return (
                      <TableRow
                        key={task._id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)",
                          "&:hover": { backgroundColor: "rgba(25,118,210,0.1)" },
                        }}
                      >
                        <TableCell>{task.studentName}</TableCell>
                        <TableCell>{task.assignedTo?.name}</TableCell>
                        <TableCell>{task.assignedTo?.team}</TableCell>
                        <TableCell>{task.moduleCode}</TableCell>
                        <TableCell>
                          <Chip
                            label={task.status}
                            size="small"
                            sx={{
                              backgroundColor: task.status === "PENDING_REVIEW" ? "rgba(245,127,23,0.2)" :
                                             task.status === "APPROVED" ? "rgba(46,125,50,0.2)" :
                                             task.status === "REWORK" ? "rgba(198,40,40,0.2)" :
                                             "rgba(25,118,210,0.2)",
                              color: task.status === "PENDING_REVIEW" ? "#F57C00" :
                                     task.status === "APPROVED" ? "#2E7D32" :
                                     task.status === "REWORK" ? "#C62828" :
                                     "#1976D2",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={!["PENDING_REVIEW", "APPROVED", "REWORK"].includes(task.status)}
                            onClick={() => handleOpenSolutionDialog(task)}
                            sx={{ borderRadius: 8 }}
                          >
                            Solution
                          </Button>
                        </TableCell>
                        <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge badgeContent={unread} color="error" invisible={!unread}>
                            <Button variant="contained" size="small" onClick={() => handleOpenChat(task)} sx={{ borderRadius: 8 }}>
                              Open Chat
                            </Button>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassContainer>

        <Dialog open={openChatDialog} onClose={handleCloseChat} maxWidth="md" fullWidth>
          <DialogTitle>Task Chat</DialogTitle>

          <DialogContent>
            {selectedTask && (
              <Paper sx={{ p: 2, mb: 2, backgroundColor: "#F4F6F8" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Task: {selectedTask.moduleCode} - {selectedTask.studentName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employee: {selectedTask.assignedTo?.name || "Unknown"}
                </Typography>
              </Paper>
            )}

            <Box sx={{ maxHeight: 380, overflowY: "auto", p: 2, mb: 2, backgroundColor: "#FFFFFF", borderRadius: 2, border: "1px solid #E0E0E0" }}>
              {chatMessages.length === 0 ? (
                <Typography color="text.secondary">No chat history yet.</Typography>
              ) : (
                chatMessages.map((chat) => renderMessageBubble(chat))
              )}
              <div ref={chatEndRef} />
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                label="Type a message"
                variant="outlined"
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <label htmlFor="teamlead-chat-files">
                  <input
                    id="teamlead-chat-files"
                    type="file"
                    multiple
                    accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png,.gif,.zip"
                    style={{ display: "none" }}
                    onChange={handleFileSelection}
                  />
                  <IconButton component="span" color="primary" size="large">
                    <AttachFile />
                  </IconButton>
                </label>
                <Button variant="contained" color="primary" onClick={sendChatMessage} endIcon={<Send />}>
                  Send
                </Button>
              </Stack>
            </Stack>

            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Selected files:
                </Typography>
                {selectedFiles.map((file) => (
                  <Typography key={file.name} variant="body2">
                    {file.name}
                  </Typography>
                ))}
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseChat}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openSolutionDialog} onClose={handleCloseSolutionDialog} maxWidth="md" fullWidth>
          <DialogTitle>Solution Review</DialogTitle>
          <DialogContent>
            {solutionDialogLoading ? (
              <Typography>Loading solution details...</Typography>
            ) : selectedSolution ? (
              <Box>
                <Paper sx={{ mb: 2, p: 2, backgroundColor: "#F4F6F8" }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Employee: {selectedSolution.employeeId?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Student: {selectedSolution.taskId?.studentName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Module: {selectedSolution.taskId?.moduleCode}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Solution Type: {selectedSolution.solutionType}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Submitted Date: {new Date(selectedSolution.submittedAt).toLocaleString()}
                  </Typography>
                </Paper>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Uploaded Files
                  </Typography>
                  {selectedSolution.files?.length > 0 ? (
                    selectedSolution.files.map((filePath, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        {renderFilePreview(filePath, index)}
                      </Box>
                    ))
                  ) : (
                    <Typography>No files available.</Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Typography>No solution details available.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSolutionDialog}>Close</Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => selectedSolution && reworkSolution(selectedSolution._id)}
              disabled={!selectedSolution}
            >
              Rework
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => selectedSolution && approveSolution(selectedSolution._id)}
              disabled={!selectedSolution}
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default TeamLeadDashboard;
