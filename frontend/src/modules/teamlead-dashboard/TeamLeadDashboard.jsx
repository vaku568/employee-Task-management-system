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
  Stack
} from "@mui/material";

import {
  AttachFile,
  Send
} from "@mui/icons-material";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import axiosInstance from "../../services/axiosInstance";

import WorkAllocation from "../work-allocation/WorkAllocation";

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
      const response = await axiosInstance.get("/dashboard");
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
      <Navbar />

      <Box sx={{ p: 4, background: "#F8FAFC", minHeight: "100vh" }}>
        <Typography variant="h4" fontWeight={700} mb={4}>
          Team Lead Dashboard
        </Typography>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h3" color="primary">
                {dashboard.totalEmployees}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Total Tasks</Typography>
              <Typography variant="h3" color="success.main">
                {dashboard.totalTasks}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Pending Reviews</Typography>
              <Typography variant="h3" color="warning.main">
                {dashboard.pendingReviews}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              sx={{ height: "100%", width: "100%" }}
              onClick={() => window.location.assign("/teamlead-solutions")}
            >
              Approved Solution Repository
            </Button>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 5, p: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Employee Approval Requests
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Qualification</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.qualification}</TableCell>
                    <TableCell>{employee.team}</TableCell>
                    <TableCell>{employee.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => approveEmployee(employee._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
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
        </Paper>

        <WorkAllocation />

        <Paper sx={{ mt: 5, p: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Assigned Work History
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Assigned Date</TableCell>
                  <TableCell>Messages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No Tasks Assigned Yet
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => {
                    const unread = unreadCounts[task._id] || 0;
                    return (
                      <TableRow key={task._id}>
                        <TableCell>{task.studentName}</TableCell>
                        <TableCell>{task.assignedTo?.name}</TableCell>
                        <TableCell>{task.assignedTo?.team}</TableCell>
                        <TableCell>{task.moduleCode}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={!["FINAL", "PARAPHRASE"].includes(task.status)}
                            onClick={() => handleOpenSolutionDialog(task)}
                          >
                            Solution
                          </Button>
                        </TableCell>
                        <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge badgeContent={unread} color="error" invisible={!unread}>
                            <Button variant="contained" size="small" onClick={() => handleOpenChat(task)}>
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
        </Paper>

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
