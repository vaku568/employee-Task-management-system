import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
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
  Link,
  Stack,
  Badge,
  MenuItem
} from "@mui/material";

import {
  AttachFile,
  Send
} from "@mui/icons-material";

import { useState, useEffect, useCallback, useRef } from "react";

import Navbar from "../../components/layout/Navbar";

import axiosInstance from "../../services/axiosInstance";

const menuItems = [
  { label: "Dashboard" },
  { label: "My Tasks" },
  { label: "Approved Solutions" },
  { label: "Rework Solutions" },
  { label: "Submission History" },
  { label: "Notifications" }
];

const EmployeeDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dashboard, setDashboard] = useState({
    assignedTasks: 0,
    completedTasks: 0,
    submittedTasks: 0
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [solutionType, setSolutionType] = useState("FINAL");
  const [solutionFiles, setSolutionFiles] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const chatEndRef = useRef(null);

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

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/dashboard/employee");
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/dashboard/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

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
          console.error(error);
        }
      })
    );

    setUnreadCounts(counts);
  };

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
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchTasks();
    fetchDashboard();
  }, [fetchNotifications, fetchTasks, fetchDashboard]);

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

  const acceptTask = async (taskId) => {
    if (!taskId) return;

    try {
      await axiosInstance.put(`/dashboard/tasks/${taskId}/accept`);
      await fetchTasks();
      await fetchDashboard();
      setOpenViewDialog(false);
      setSelectedTask(null);
      alert("Task accepted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to accept task. Please try again.");
    }
  };

  const previewFile = (taskId) => {
    if (!taskId) return;
    const baseUrl = axiosInstance.defaults.baseURL?.replace(/\/$/, "") || "http://localhost:5000/api";
    window.open(`${baseUrl}/tasks/${taskId}/file`, "_blank");
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedTask(null);
  };

  const handleMessage = async (task) => {
    setSelectedTask(task);
    setOpenMessageDialog(true);
    await fetchChatMessages(task._id);
    await fetchTaskUnreadCounts(tasks);
  };

  const handleCloseMessageDialog = () => {
    setOpenMessageDialog(false);
    setSelectedTask(null);
    setChatMessages([]);
    setChatMessage("");
    setSelectedFiles([]);
  };

  const handleCloseSubmitDialog = () => {
    setOpenSubmitDialog(false);
    setSolutionType("FINAL");
    setSolutionFiles([]);
  };

  const handleFileSelection = (event) => {
    setSelectedFiles(Array.from(event.target.files || []));
  };

  const handleSolutionFileSelection = (event) => {
    setSolutionFiles(Array.from(event.target.files || []));
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };

  const clearSolutionFiles = () => {
    setSolutionFiles([]);
  };

  const sendChatMessage = async () => {
    if (!selectedTask) return;

    if (!chatMessage.trim() && selectedFiles.length === 0) {
      alert("Please enter a message or attach files before sending.");
      return;
    }

    try {
      const receiverId = selectedTask.assignedBy?._id || selectedTask.assignedBy;
      if (!receiverId) {
        alert("Unable to determine the team lead receiver ID.");
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
      console.error(error);
    }
  };

  const openSubmitSolutionDialog = (task) => {
    setSelectedTask(task);
    setOpenSubmitDialog(true);
    setSolutionType("FINAL");
    setSolutionFiles([]);
  };

  const submitSolution = async () => {
    if (!selectedTask) return;

    if (solutionFiles.length === 0) {
      alert("Please select at least one solution file to submit.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("taskId", selectedTask._id);
      formData.append("solutionType", solutionType);
      solutionFiles.forEach((file) => formData.append("files", file));

      await axiosInstance.post("/solutions", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      handleCloseSubmitDialog();
      await fetchTasks();
      await fetchDashboard();
      alert("Solution submitted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to submit solution. Please try again.");
    }
  };

  const renderFilePreview = (filePath, index) => {
    const url = getAttachmentUrl(filePath);
    const fileName = String(filePath).split("/").pop();

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

    return (
      <Box key={index} sx={{ mt: 1, p: 1, border: "1px solid #E0E0E0", borderRadius: 2, backgroundColor: "#F7F7F7" }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {fileName}
        </Typography>
        <Link href={url} target="_blank" rel="noreferrer" underline="hover">
          Open
        </Link>
      </Box>
    );
  };

  const renderMessageBubble = (chat) => {
    const senderId = chat.senderId?._id || chat.senderId;
    const isYou = String(senderId) === String(currentUser?._id);
    const senderName = isYou ? "You" : chat.senderId?.name || "Team Lead";

    return (
      <Box
        key={chat._id}
        sx={{
          display: "flex",
          justifyContent: isYou ? "flex-end" : "flex-start",
          mb: 1
        }}
      >
        <Paper
          sx={{
            p: 2,
            maxWidth: "80%",
            backgroundColor: isYou ? "#DCF8C6" : "#F1F0F0",
            borderRadius: 3,
            borderTopRightRadius: isYou ? 0 : 16,
            borderTopLeftRadius: isYou ? 16 : 0,
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
      <Navbar />

      <Box sx={{ p: 4, background: "#F8FAFC", minHeight: "100vh" }}>
        <Typography variant="h4" fontWeight={700} mb={4}>
          Employee Dashboard
        </Typography>

        <Typography variant="h6" mb={3}>
          Welcome Employee 👋
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Assigned Tasks</Typography>
              <Typography variant="h3" color="primary">
                {dashboard.assignedTasks}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Completed Tasks</Typography>
              <Typography variant="h3" color="success.main">
                {dashboard.completedTasks}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Pending Tasks</Typography>
              <Typography variant="h3" color="warning.main">
                {dashboard.submittedTasks}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 5, p: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Assigned Tasks
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>University</TableCell>
                  <TableCell>Module Code</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No Tasks Assigned
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => {
                    const unread = unreadCounts[task._id] || 0;
                    return (
                      <TableRow key={task._id}>
                        <TableCell>{task.studentName}</TableCell>
                        <TableCell>{task.university}</TableCell>
                        <TableCell>{task.moduleCode}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => handleViewTask(task)}>
                            View
                          </Button>
                          {task.status === "PROGRESS" && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => openSubmitSolutionDialog(task)}
                            >
                              Submit Solution
                            </Button>
                          )}
                          <Badge badgeContent={unread} color="error" invisible={!unread}>
                            <Button variant="contained" color="secondary" size="small" onClick={() => handleMessage(task)}>
                              Message
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
        </Paper>

        <Paper sx={{ mt: 5, p: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Notifications
          </Typography>
          <List>
            {notifications.length === 0 ? (
              <Typography>No Notifications Found</Typography>
            ) : (
              notifications.map((notification) => (
                <ListItem key={notification._id} divider>
                  <ListItemText primary={notification.title} secondary={notification.message} />
                </ListItem>
              ))
            )}
          </List>
        </Paper>

        <Dialog open={openMessageDialog} onClose={handleCloseMessageDialog} maxWidth="md" fullWidth>
          <DialogTitle>Task Chat</DialogTitle>

          <DialogContent>
            {selectedTask && (
              <Paper sx={{ mb: 2, p: 2, backgroundColor: "#F4F6F8" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Task: {selectedTask.moduleCode} - {selectedTask.studentName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Team Lead: {selectedTask.assignedBy?.name ?? "Unknown"}
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
            <Button onClick={handleCloseMessageDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openSubmitDialog} onClose={handleCloseSubmitDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Submit Solution</DialogTitle>

          <DialogContent>
            {selectedTask && (
              <Paper sx={{ mb: 2, p: 2, backgroundColor: "#F4F6F8" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Task: {selectedTask.moduleCode} - {selectedTask.studentName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload solution files for this task.
                </Typography>
              </Paper>
            )}

            <TextField
              select
              fullWidth
              label="Solution Type"
              value={solutionType}
              onChange={(e) => setSolutionType(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="FINAL">FINAL</MenuItem>
              <MenuItem value="PARAPHRASE">PARAPHRASE</MenuItem>
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
              <Button component="span" variant="outlined" startIcon={<AttachFile />}>
                Choose Files
              </Button>
            </label>

            {solutionFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Selected solution files:
                </Typography>
                {solutionFiles.map((file) => (
                  <Typography key={file.name} variant="body2">
                    {file.name}
                  </Typography>
                ))}
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseSubmitDialog}>Cancel</Button>
            <Button variant="contained" onClick={submitSolution}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
          <DialogTitle>Assignment Details</DialogTitle>

          <DialogContent>
            {selectedTask ? (
              <>
                <Typography>Student: {selectedTask.studentName}</Typography>
                <Typography>University: {selectedTask.university}</Typography>
                <Typography>Module: {selectedTask.moduleCode}</Typography>
                <Typography>Description: {selectedTask.description}</Typography>
                <Typography>Notes: {selectedTask.additionalNotes}</Typography>
              </>
            ) : (
              <Typography>No task selected.</Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => previewFile(selectedTask?._id)} disabled={!selectedTask?._id}>
              Preview File
            </Button>
            <Button variant="contained" onClick={() => acceptTask(selectedTask?._id)} disabled={!selectedTask?._id}>
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default EmployeeDashboard;
