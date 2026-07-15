import { useEffect, useMemo, useState, useRef, useCallback } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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
  Tooltip,
  Typography,
  Badge,
  Link,
  Stack,
  InputLabel,
  Select,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

import {
  Visibility,
  Download,
  AttachFile,
  Send,
} from "@mui/icons-material";

import axiosInstance from "../../services/axiosInstance";
import socketService from "../../services/socket";
import TeamLeadLayout from "../../layouts/TeamLeadLayout";
import PageHeader from "../../components/layout/PageHeader";
import GlassContainer from "../../components/layout/GlassContainer";

//==================================================
// Utility Functions
//==================================================

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

const getStatusColor = (status) => {
  const colors = {
    ASSIGNED: "default",
    PROGRESS: "info",
    PENDING_REVIEW: "warning",
    APPROVED: "success",
    REWORK: "error",
    REJECTED: "error",
  };
  return colors[status] || "default";
};

const formatDate = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString();
};

//==================================================
// Main Component
//==================================================

const AssignedHistory = () => {
  //--------------------------------------------------
  // States
  //--------------------------------------------------

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assignedDateFilter, setAssignedDateFilter] = useState(null);
  const [submittedDateFilter, setSubmittedDateFilter] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // View Dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Solution Dialog
  const [solutionDialogOpen, setSolutionDialogOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [solutionDialogLoading, setSolutionDialogLoading] = useState(false);
  const [solutionExists, setSolutionExists] = useState(false);

  // Chat Dialog
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const chatEndRef = useRef(null);

  const currentUser = useRef(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  ).current;

  //--------------------------------------------------
  // API Calls
  //--------------------------------------------------

  const fetchAssignedTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "Unable to load assigned history.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSolutionForTask = useCallback(async (taskId) => {
    try {
      const response = await axiosInstance.get(`/solutions/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }, []);

  const fetchChatMessages = useCallback(async (taskId) => {
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
      c7nsole.log(error);
    }
  }, []);

  const fetchTaskUnreadCounts = useCallback(async (currentTasks) => {
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
  }, [currentUser]);

  const approveSolution = useCallback(async (solutionId) => {
    try {
      await axiosInstance.put(`/solutions/${solutionId}/approve`);
      await fetchAssignedTasks();
      handleCloseSolutionDialog();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Solution Approved",
      });
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to approve solution",
      });
    }
  }, [fetchAssignedTasks]);

  const reworkSolution = useCallback(async (solutionId) => {
    try {
      await axiosInstance.put(`/solutions/${solutionId}/rework`);
      await fetchAssignedTasks();
      handleCloseSolutionDialog();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Rework Sent",
      });
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to send rework",
      });
    }
  }, [fetchAssignedTasks]);

  const sendChatMessage = useCallback(async () => {
    if (!selectedTask) return;

    if (!chatMessage.trim() && selectedFiles.length === 0) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Please enter a message or attach files before sending.",
      });
      return;
    }

    try {
      const receiverId = selectedTask.assignedTo?._id || selectedTask.assignedTo;
      if (!receiverId) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Unable to determine the employee receiver ID.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("message", chatMessage.trim());
      formData.append("receiverId", receiverId);
      selectedFiles.forEach((file) => formData.append("files", file));

      await axiosInstance.post(`/task-chat/${selectedTask._id}`, formData);
      setChatMessage("");
      setSelectedFiles([]);
      await fetchChatMessages(selectedTask._id);
      await fetchTaskUnreadCounts(tasks);
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to send message",
      });
    }
  }, [selectedTask, chatMessage, selectedFiles, tasks, fetchChatMessages, fetchTaskUnreadCounts]);

  //--------------------------------------------------
  // Effects
  //--------------------------------------------------

  useEffect(() => {
    fetchAssignedTasks();

    // Socket.IO event listeners for real-time updates
    const socket = socketService.getSocket();
    if (socket) {
      const handleTaskAssigned = (data) => {
        console.log("[AssignedHistory] New task assigned:", data);
        fetchAssignedTasks();
      };

      const handleTaskUpdated = (data) => {
        console.log("[AssignedHistory] Task updated:", data);
        fetchAssignedTasks();
      };

      socket.on("taskAssigned", handleTaskAssigned);
      socket.on("taskUpdated", handleTaskUpdated);

      return () => {
        socket.off("taskAssigned", handleTaskAssigned);
        socket.off("taskUpdated", handleTaskUpdated);
      };
    }
  }, [fetchAssignedTasks]);

  useEffect(() => {
    if (tasks.length > 0 && currentUser) {
      fetchTaskUnreadCounts(tasks);
    }
  }, [tasks, currentUser, fetchTaskUnreadCounts]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  //--------------------------------------------------
  // Statistics
  //--------------------------------------------------

  const statistics = useMemo(() => {
    return {
      total: tasks.length,
      assigned: tasks.filter((t) => t.status === "ASSIGNED").length,
      progress: tasks.filter((t) => t.status === "PROGRESS").length,
      approved: tasks.filter((t) => t.status === "APPROVED").length,
      rework: tasks.filter((t) => t.status === "REWORK").length,
    };
  }, [tasks]);

  //--------------------------------------------------
  // Filters
  //--------------------------------------------------

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const search = searchText.toLowerCase();
      const matchesSearch =
        task.studentName?.toLowerCase().includes(search) ||
        task.moduleCode?.toLowerCase().includes(search) ||
        task.university?.toLowerCase().includes(search) ||
        task.assignedTo?.name?.toLowerCase().includes(search);

      const matchesTeam = teamFilter === "ALL" || task.assignedTo?.team === teamFilter;
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;

      const taskAssignedDate = task.assignedAt || task.createdAt;
      const matchesAssignedDate =
        !assignedDateFilter ||
        new Date(taskAssignedDate).toDateString() === assignedDateFilter.toDateString();

      const matchesSubmittedDate =
        !submittedDateFilter ||
        (task.submittedAt && new Date(task.submittedAt).toDateString() === submittedDateFilter.toDateString());

      return matchesSearch && matchesTeam && matchesStatus && matchesAssignedDate && matchesSubmittedDate;
    });
  }, [tasks, searchText, teamFilter, statusFilter, assignedDateFilter, submittedDateFilter]);

  const teams = useMemo(() => {
    const uniqueTeams = [...new Set(tasks.map((t) => t.assignedTo?.team).filter(Boolean))];
    return uniqueTeams.sort();
  }, [tasks]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(tasks.map((t) => t.status).filter(Boolean))];
    return uniqueStatuses.sort();
  }, [tasks]);

  //--------------------------------------------------
  // Handlers
  //--------------------------------------------------

  const handleViewTask = useCallback((task) => {
    setSelectedTask(task);
    setViewOpen(true);
  }, []);

  const handleCloseViewDialog = useCallback(() => {
    setSelectedTask(null);
    setViewOpen(false);
  }, []);

  const handleOpenSolutionDialog = useCallback(async (task) => {
    if (!task) return;
    setSelectedTask(task);
    setSolutionDialogLoading(true);

    const solution = await fetchSolutionForTask(task._id);

    setSolutionDialogLoading(false);

    if (!solution) {
      setSolutionExists(false);
      setSelectedSolution(null);
    } else {
      setSolutionExists(true);
      setSelectedSolution(solution);
    }

    setSolutionDialogOpen(true);
  }, [fetchSolutionForTask]);

  const handleCloseSolutionDialog = useCallback(() => {
    setSolutionDialogOpen(false);
    setSelectedSolution(null);
    setSelectedTask(null);
    setSolutionExists(false);
  }, []);

  const handleOpenChatDialog = useCallback(async (task) => {
    setSelectedTask(task);
    setChatDialogOpen(true);
    await fetchChatMessages(task._id);
    await fetchTaskUnreadCounts(tasks);
  }, [fetchChatMessages, fetchTaskUnreadCounts, tasks]);

  const handleCloseChatDialog = useCallback(() => {
    setChatDialogOpen(false);
    setSelectedTask(null);
    setChatMessages([]);
    setChatMessage("");
    setSelectedFiles([]);
  }, []);

  const handleFileSelection = useCallback((event) => {
    setSelectedFiles(Array.from(event.target.files || []));
  }, []);

  const clearSelectedFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const handleViewAttachment = useCallback((fileUrl) => {
    if (!fileUrl) return;
    const url = getAttachmentUrl(fileUrl);
    const fileName = String(fileUrl).split("/").pop();
    const ext = fileName.split(".").pop().toLowerCase();

    // Files that can be opened directly in browser
    const directOpenExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt", "html", "htm"];
    
    // Office documents that need Office Online Viewer
    const officeExtensions = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

    if (directOpenExtensions.includes(ext)) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (officeExtensions.includes(ext)) {
      const officeViewer = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
      window.open(officeViewer, "_blank", "noopener,noreferrer");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleDownloadAttachment = useCallback((fileUrl) => {
    if (!fileUrl) return;
    const url = getAttachmentUrl(fileUrl);
    const fileName = String(fileUrl).split("/").pop();
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  //--------------------------------------------------
  // Render Helpers
  //--------------------------------------------------

  const renderFilePreview = useCallback((filePath, index) => {
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
  }, []);

  const renderMessageBubble = useCallback((chat) => {
    const senderId = chat.senderId?._id || chat.senderId;
    const isTeamLead = String(senderId) === String(currentUser?._id);
    const senderName = isTeamLead ? "You" : chat.senderId?.name || "Employee";

    return (
      <Box
        key={chat._id}
        sx={{
          display: "flex",
          justifyContent: isTeamLead ? "flex-end" : "flex-start",
          mb: 1,
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
            boxShadow: "none",
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
  }, [currentUser, renderFilePreview]);

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (
    <TeamLeadLayout pageTitle="Assigned History">
      <PageHeader
        title="Assigned History"
        subtitle="View, search and manage all work assigned to employees."
      />

      {/* =======================================
              Statistics
      ======================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {[
          { title: "Total Tasks", value: statistics.total, color: "#2563EB" },
          { title: "Assigned", value: statistics.assigned, color: "#F59E0B" },
          { title: "Progress", value: statistics.progress, color: "#3B82F6" },
          { title: "Approved", value: statistics.approved, color: "#16A34A" },
          { title: "Rework", value: statistics.rework, color: "#DC2626" },
        ].map((item) => (
          <Box
            key={item.title}
            sx={{
              p: 3,
              borderRadius: "20px",
              backdropFilter: "blur(24px)",
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "18px",
                bgcolor: `${item.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                border: `2px solid ${item.color}30`,
              }}
            >
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: item.color }} />
            </Box>
            <Typography color="text.primary" fontWeight={600} fontSize={14}>
              {item.title}
            </Typography>
            <Typography mt={1} fontSize={36} fontWeight={800} color="text.primary">
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* =======================================
               Toolbar
      ======================================= */}

      <GlassContainer
        sx={{
          backdropFilter: "blur(24px)",
          background: "rgba(255, 255, 255, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              placeholder="Search Student / Module / University / Employee"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ minWidth: 280 }}
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            />

            <TextField
              select
              size="small"
              label="Team"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              sx={{ minWidth: 140 }}
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              <MenuItem value="ALL">All Teams</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team} value={team}>
                  {team}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 140 }}
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              <MenuItem value="ALL">All Status</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Assigned Date"
                value={assignedDateFilter}
                onChange={setAssignedDateFilter}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      minWidth: 160,
                      "& .MuiInputBase-root": {
                        borderRadius: "12px",
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Submitted Date"
                value={submittedDateFilter}
                onChange={setSubmittedDateFilter}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      minWidth: 160,
                      "& .MuiInputBase-root": {
                        borderRadius: "12px",
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Button
            variant="contained"
            onClick={fetchAssignedTasks}
            sx={{ borderRadius: "14px", textTransform: "none", px: 4 }}
          >
            Refresh
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Table stickyHeader>
              <TableHead
                sx={{
                  "& .MuiTableCell-root": {
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    fontWeight: 700,
                    color: "#1e293b",
                    borderBottom: "2px solid rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Solution</TableCell>
                  <TableCell>Assigned Date</TableCell>
                  <TableCell>Submitted Date</TableCell>
                  <TableCell>Task Chat</TableCell>
                  <TableCell align="center">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography py={5} color="text.secondary">
                        No Assigned Tasks Found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => {
                    const unread = unreadCounts[task._id] || 0;
                    return (
                      <TableRow
                        hover
                        key={task._id}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.04)",
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={600}>{task.studentName}</Typography>
                        </TableCell>
                        <TableCell>{task.assignedTo?.name}</TableCell>
                        <TableCell>
                          <Chip label={task.status} size="small" color={getStatusColor(task.status)} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenSolutionDialog(task)}
                            sx={{ borderRadius: "8px" }}
                          >
                            Solution
                          </Button>
                        </TableCell>
                        <TableCell>{formatDate(task.assignedAt || task.createdAt)}</TableCell>
                        <TableCell>{formatDate(task.submittedAt)}</TableCell>
                        <TableCell>
                          <Badge badgeContent={unread} color="error" invisible={!unread}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenChatDialog(task)}
                              sx={{ borderRadius: "8px" }}
                            >
                              Chat
                            </Button>
                          </Badge>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton color="primary" onClick={() => handleViewTask(task)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </GlassContainer>

      {/* ==========================================
              View Details Dialog
      ========================================== */}

      <Dialog
        open={viewOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backdropFilter: "blur(28px)",
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, color: "#1e293b" }}>Task Details</DialogTitle>
        <DialogContent dividers>
          {selectedTask && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Student Name</Typography>
                <Typography>{selectedTask.studentName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>University</Typography>
                <Typography>{selectedTask.university}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Module Code</Typography>
                <Typography>{selectedTask.moduleCode}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Employee Name</Typography>
                <Typography>{selectedTask.assignedTo?.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Team</Typography>
                <Chip color="primary" label={selectedTask.assignedTo?.team} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Status</Typography>
                <Chip label={selectedTask.status} color={getStatusColor(selectedTask.status)} size="small" />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={700}>Description</Typography>
                <Typography sx={{ whiteSpace: "pre-wrap" }}>{selectedTask.description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={700}>Additional Notes</Typography>
                <Typography sx={{ whiteSpace: "pre-wrap" }}>{selectedTask.additionalNotes || "No additional notes."}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Assigned Date</Typography>
                <Typography>{formatDate(selectedTask.assignedAt || selectedTask.createdAt)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Submitted Date</Typography>
                <Typography>{formatDate(selectedTask.submittedAt)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={700} mb={1}>Original Uploaded Assignment</Typography>
                {selectedTask.uploadedFile ? (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                      {String(selectedTask.uploadedFile).split("/").pop()}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewAttachment(selectedTask.uploadedFile)}
                        startIcon={<Visibility />}
                        sx={{ borderRadius: "12px" }}
                      >
                        View Attachment
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownloadAttachment(selectedTask.uploadedFile)}
                        startIcon={<Download />}
                        sx={{ borderRadius: "12px" }}
                      >
                        Download Attachment
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Typography color="text.secondary">No attachment uploaded.</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseViewDialog} sx={{ borderRadius: "12px" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==========================================
              Solution Review Dialog
      ========================================== */}

      <Dialog
        open={solutionDialogOpen}
        onClose={handleCloseSolutionDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backdropFilter: "blur(28px)",
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, color: "#1e293b" }}>Solution Review</DialogTitle>
        <DialogContent dividers>
          {solutionDialogLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : !solutionExists ? (
            <Typography color="text.secondary">No solution submitted for this task yet.</Typography>
          ) : selectedSolution ? (
            <Box>
              <Paper sx={{ mb: 2, p: 2, backgroundColor: "#F4F6F8", borderRadius: "12px" }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Employee: {selectedSolution.employeeId?.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Student: {selectedSolution.taskId?.studentName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  University: {selectedSolution.taskId?.university}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Module: {selectedSolution.taskId?.moduleCode}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Solution Type: {selectedSolution.solutionType}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Review Status: {selectedSolution.reviewStatus}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Submitted Date: {new Date(selectedSolution.submittedAt).toLocaleString()}
                </Typography>
              </Paper>
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight={700}>
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
          <Button onClick={handleCloseSolutionDialog} sx={{ borderRadius: "12px" }}>Close</Button>
          {solutionExists && selectedSolution && (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={() => reworkSolution(selectedSolution._id)}
                sx={{ borderRadius: "12px" }}
              >
                Rework
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => approveSolution(selectedSolution._id)}
                sx={{ borderRadius: "12px" }}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* ==========================================
              Task Chat Dialog
      ========================================== */}

      <Dialog
        open={chatDialogOpen}
        onClose={handleCloseChatDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backdropFilter: "blur(28px)",
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, color: "#1e293b" }}>Task Chat</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Paper sx={{ p: 2, mb: 2, backgroundColor: "#F4F6F8", borderRadius: "12px" }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={700}>
                Student: {selectedTask.studentName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employee: {selectedTask.assignedTo?.name || "Unknown"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Module: {selectedTask.moduleCode}
              </Typography>
            </Paper>
          )}

          <Box
            sx={{
              maxHeight: 380,
              overflowY: "auto",
              p: 2,
              mb: 2,
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              border: "1px solid #E0E0E0",
            }}
          >
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
              sx={{ borderRadius: "12px" }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <label htmlFor="assigned-history-chat-files">
                <input
                  id="assigned-history-chat-files"
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
              <Button variant="contained" color="primary" onClick={sendChatMessage} endIcon={<Send />} sx={{ borderRadius: "12px" }}>
                Send
              </Button>
            </Stack>
          </Stack>

          {selectedFiles.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
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
          <Button onClick={handleCloseChatDialog} sx={{ borderRadius: "12px" }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </TeamLeadLayout>
  );
};

export default AssignedHistory;