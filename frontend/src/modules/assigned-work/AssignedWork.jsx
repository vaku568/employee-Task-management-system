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
import EmployeeLayout from "../../layouts/EmployeeLayout";
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
    ASSIGNED: "primary",
    PROGRESS: "success",
    PENDING_REVIEW: "warning",
    APPROVED: "success",
    REWORK: "error",
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

const AssignedWork = () => {
  //--------------------------------------------------
  // States
  //--------------------------------------------------

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assignedDateFilter, setAssignedDateFilter] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // View Dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);

  // Solution Dialog
  const [solutionDialogOpen, setSolutionDialogOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [solutionDialogLoading, setSolutionDialogLoading] = useState(false);
  const [solutionExists, setSolutionExists] = useState(false);
  const [solutionType, setSolutionType] = useState("FINAL");
  const [solutionFiles, setSolutionFiles] = useState([]);

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
      console.log("[DEBUG] Fetching assigned tasks...");
      const res = await axiosInstance.get("/my-tasks");
      console.log("[DEBUG] API Response:", res.data);
      setTasks(res.data);
      console.log("[DEBUG] Tasks state updated:", res.data);
    } catch (err) {
      console.error("[ERROR] Fetch assigned tasks:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "Unable to load assigned work.",
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
      console.log(error);
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

  const acceptTask = useCallback(async (taskId) => {
    try {
      setAcceptLoading(true);
      console.log("[DEBUG] acceptTask - Calling API for taskId:", taskId);
      const response = await axiosInstance.put(`/my-tasks/${taskId}/accept`);
      console.log("[DEBUG] acceptTask - API response:", response.data);
      await fetchAssignedTasks();
      console.log("[DEBUG] acceptTask - Tasks refreshed");
      setSnackbar({
        open: true,
        severity: "success",
        message: "Work accepted successfully. You can now start working on this assignment.",
      });

      // Auto-close dialog after 1.5 seconds
      setTimeout(() => {
        setSelectedTask(null);
        setViewOpen(false);
      }, 1500);

    } catch (error) {
      console.log("[ERROR] acceptTask:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to accept work. Please try again.",
      });
    } finally {
      setAcceptLoading(false);
    }
  }, [fetchAssignedTasks]);

  const submitSolution = useCallback(async () => {
    if (!selectedTask || solutionFiles.length === 0) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Please select files to upload.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("taskId", selectedTask._id);
      formData.append("solutionType", solutionType);
      solutionFiles.forEach((file) => formData.append("files", file));

      await axiosInstance.post("/solutions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchAssignedTasks();
      handleCloseSolutionDialog();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Solution submitted successfully.",
      });
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to submit solution.",
      });
    }
  }, [selectedTask, solutionFiles, solutionType, fetchAssignedTasks]);

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
      const receiverId = selectedTask.assignedBy?._id || selectedTask.assignedBy;
      if (!receiverId) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Unable to determine the team lead receiver ID.",
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
        message: "Failed to send message.",
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
        console.log("[AssignedWork] New task assigned:", data);
        fetchAssignedTasks();
      };

      const handleTaskUpdated = (data) => {
        console.log("[AssignedWork] Task updated:", data);
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
      pendingReview: tasks.filter((t) => t.status === "PENDING_REVIEW").length,
      completed: tasks.filter((t) => t.status === "APPROVED").length,
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
        task.university?.toLowerCase().includes(search);

      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;

      const taskAssignedDate = task.assignedAt || task.createdAt;
      const matchesAssignedDate =
        !assignedDateFilter ||
        new Date(taskAssignedDate).toDateString() === assignedDateFilter.toDateString();

      return matchesSearch && matchesStatus && matchesAssignedDate;
    });
  }, [tasks, searchText, statusFilter, assignedDateFilter]);

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
      setSolutionType("FINAL");
    } else {
      setSolutionExists(true);
      setSelectedSolution(solution);
      setSolutionType(solution.solutionType || "FINAL");
    }

    setSolutionFiles([]);
    setSolutionDialogOpen(true);
  }, [fetchSolutionForTask]);

  const handleCloseSolutionDialog = useCallback(() => {
    setSolutionDialogOpen(false);
    setSelectedSolution(null);
    setSelectedTask(null);
    setSolutionExists(false);
    setSolutionType("FINAL");
    setSolutionFiles([]);
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

  const handleSolutionFileSelection = useCallback((event) => {
    setSolutionFiles(Array.from(event.target.files || []));
  }, []);

  const clearSelectedFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const handleViewAttachment = useCallback((fileUrl) => {
    if (!fileUrl) return;
    const url = getAttachmentUrl(fileUrl);
    const fileName = String(fileUrl).split("/").pop();
    const ext = fileName.split(".").pop().toLowerCase();

    const directOpenExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt", "html", "htm"];
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
        </Box>
      );
    }

    if (lower.endsWith(".pdf")) {
      return (
        <Box key={index} sx={{ mt: 1, p: 1, border: "1px solid #E0E0E0", borderRadius: 2, backgroundColor: "#F7F7F7" }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            📄 {fileName}
          </Typography>
        </Box>
      );
    }

    return (
      <Box key={index} sx={{ mt: 1, p: 1, border: "1px solid #E0E0E0", borderRadius: 2, backgroundColor: "#F7F7F7" }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          📄 {fileName}
        </Typography>
      </Box>
    );
  }, []);

  const renderMessageBubble = useCallback((chat) => {
    const senderId = chat.senderId?._id || chat.senderId;
    const isEmployee = String(senderId) === String(currentUser?._id);
    const senderName = isEmployee ? "You" : chat.senderId?.name || "Team Lead";

    return (
      <Box
        key={chat._id}
        sx={{
          display: "flex",
          justifyContent: isEmployee ? "flex-end" : "flex-start",
          mb: 1,
        }}
      >
        <Paper
          sx={{
            p: 2,
            maxWidth: "80%",
            backgroundColor: isEmployee ? "#DCF8C6" : "#F1F0F0",
            borderRadius: 3,
            borderTopRightRadius: isEmployee ? 0 : 16,
            borderTopLeftRadius: isEmployee ? 16 : 0,
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
    <EmployeeLayout>
      <PageHeader
        title="Assigned Work"
        subtitle="View, accept, complete and communicate regarding your assigned work."
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
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {[
          { title: "Total Assigned Work", value: statistics.total, color: "#2563EB" },
          { title: "In Progress", value: statistics.progress, color: "#3B82F6" },
          { title: "Pending Review", value: statistics.pendingReview, color: "#F59E0B" },
          { title: "Completed", value: statistics.completed, color: "#16A34A" },
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
              placeholder="Search Student / Module / University"
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
                  <TableCell>University</TableCell>
                  <TableCell>Module Code</TableCell>
                  <TableCell>Assigned Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Solution</TableCell>
                  <TableCell>Task Chat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography py={5} color="text.secondary">
                        No assigned work available.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => {
                    const unread = unreadCounts[task._id] || 0;
                    const canSubmitSolution = ["ASSIGNED", "PROGRESS", "REWORK"].includes(task.status);
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
                        <TableCell>{task.university}</TableCell>
                        <TableCell>{task.moduleCode}</TableCell>
                        <TableCell>{formatDate(task.assignedAt || task.createdAt)}</TableCell>
                        <TableCell>
                          <Chip label={task.status} size="small" color={getStatusColor(task.status)} />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton color="primary" onClick={() => handleViewTask(task)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenSolutionDialog(task)}
                            disabled={!canSubmitSolution}
                            sx={{ borderRadius: "8px" }}
                          >
                            Solution
                          </Button>
                        </TableCell>
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
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, color: "#1e293b" }}>Assignment Details</DialogTitle>
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
              <Grid item xs={12}>
                <Typography fontWeight={700} mb={2}>Assignment Attachments</Typography>
                {selectedTask.uploadedFiles && selectedTask.uploadedFiles.length > 0 ? (
                  <Box>
                    {selectedTask.uploadedFiles.map((file, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        {renderFilePreview(file, index)}
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewAttachment(file)}
                            startIcon={<Visibility />}
                            sx={{ borderRadius: "8px" }}
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleDownloadAttachment(file)}
                            startIcon={<Download />}
                            sx={{ borderRadius: "8px" }}
                          >
                            Download
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : selectedTask.uploadedFile ? (
                  <Box>
                    {renderFilePreview(selectedTask.uploadedFile, 0)}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewAttachment(selectedTask.uploadedFile)}
                        startIcon={<Visibility />}
                        sx={{ borderRadius: "8px" }}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleDownloadAttachment(selectedTask.uploadedFile)}
                        startIcon={<Download />}
                        sx={{ borderRadius: "8px" }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Typography color="text.secondary">No attachments.</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {selectedTask?.status === "ASSIGNED" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => acceptTask(selectedTask._id)}
              disabled={acceptLoading}
              sx={{ borderRadius: "12px" }}
            >
              {acceptLoading ? "Accepting..." : "Accept Work"}
            </Button>
          )}
          <Button variant="contained" onClick={handleCloseViewDialog} sx={{ borderRadius: "12px" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==========================================
              Solution Upload Dialog
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
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, color: "#1e293b" }}>Submit Solution</DialogTitle>
        <DialogContent dividers>
          {solutionDialogLoading ? (
            <Typography>Loading...</Typography>
          ) : selectedTask ? (
            <Box>
              <Paper sx={{ mb: 2, p: 2, backgroundColor: "#F4F6F8" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Task: {selectedTask.moduleCode} - {selectedTask.studentName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Status: {selectedTask.status}
                </Typography>
              </Paper>

              {solutionExists && selectedSolution && (
                <Box sx={{ mb: 2, p: 2, backgroundColor: "#FFF3E0", borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Previous Submission
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Type: {selectedSolution.solutionType}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Submitted: {new Date(selectedSolution.submittedAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Files: {selectedSolution.files?.length || 0}
                  </Typography>
                </Box>
              )}

              <TextField
                select
                fullWidth
                label="Solution Type"
                value={solutionType}
                onChange={(e) => setSolutionType(e.target.value)}
                sx={{ mb: 2 }}
                disabled={solutionExists}
              >
                <MenuItem value="FINAL">Final Solution</MenuItem>
                <MenuItem value="PARAPHRASE">Paraphrase Solution</MenuItem>
              </TextField>

              <label htmlFor="solution-files-input">
                <input
                  id="solution-files-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                  style={{ display: "none" }}
                  onChange={handleSolutionFileSelection}
                />
                <Button component="span" variant="outlined" startIcon={<AttachFile />} sx={{ borderRadius: "8px" }}>
                  Choose Files
                </Button>
              </label>

              {solutionFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Selected files:
                  </Typography>
                  {solutionFiles.map((file) => (
                    <Typography key={file.name} variant="body2">
                      {file.name}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            <Typography>No task selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSolutionDialog} sx={{ borderRadius: "12px" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitSolution}
            disabled={solutionFiles.length === 0}
            sx={{ borderRadius: "12px" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==========================================
              Task Chat Dialog
      ========================================== */}

      <Dialog open={chatDialogOpen} onClose={handleCloseChatDialog} maxWidth="md" fullWidth>
        <DialogTitle>Task Chat</DialogTitle>

        <DialogContent>
          {selectedTask && (
            <Paper sx={{ p: 2, mb: 2, backgroundColor: "#F4F6F8" }}>
              <Typography variant="subtitle2" gutterBottom>
                Task: {selectedTask.moduleCode} - {selectedTask.studentName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team Lead: {selectedTask.assignedBy?.name || "Unknown"}
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
              <label htmlFor="employee-chat-files">
                <input
                  id="employee-chat-files"
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
          <Button onClick={handleCloseChatDialog}>Close</Button>
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
    </EmployeeLayout>
  );
};

export default AssignedWork;
