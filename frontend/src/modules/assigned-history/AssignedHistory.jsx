import { useEffect, useMemo, useState } from "react";

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
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import axiosInstance from "../../services/axiosInstance";
import SolutionDialog from "./SolutionDialog";
import TeamLeadLayout from "../../layouts/TeamLeadLayout"
import PageHeader from "../../components/layout/PageHeader";
import GlassContainer from "../../components/layout/GlassContainer";

const AssignedHistory = () => {

  //--------------------------------------------------
  // States
  //--------------------------------------------------

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] =
    useState("");

  const [teamFilter, setTeamFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

   const [viewOpen, setViewOpen] =
    useState(false);

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      severity: "success",
      message: "",
    });
    //--------------------------------------------------
// Solution Dialog
//--------------------------------------------------

const [solutionDialogOpen, setSolutionDialogOpen] =
  useState(false);

const [selectedTask, setSelectedTask] =
  useState(null);

  //--------------------------------------------------
  // Fetch Assigned Tasks
  //--------------------------------------------------

  const fetchAssignedTasks = async () => {

    try {

      setLoading(true);

      const res =
        await axiosInstance.get("/tasks");

      setTasks(res.data);

    } catch (err) {

      console.error(err);

      setSnackbar({

        open: true,

        severity: "error",

        message:
          err?.response?.data?.message ||
          "Unable to load assigned history.",

      });

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchAssignedTasks();

  }, []);

  //--------------------------------------------------
  // View Task
  //--------------------------------------------------

  const handleViewTask = (task) => {

    setSelectedTask(task);

    setViewOpen(true);

  };
  
  const handleCloseDialog = () => {

    setSelectedTask(null);

    setViewOpen(false);

  };
  //--------------------------------------------------
// Solution Dialog
//--------------------------------------------------

const handleOpenSolution = (task) => {

  setSelectedTask(task);

  setSolutionDialogOpen(true);

};

const handleCloseSolution = () => {

  setSolutionDialogOpen(false);

};

  //--------------------------------------------------
  // Filter Tasks
  //--------------------------------------------------

  const filteredTasks = useMemo(() => {

    return tasks.filter((task) => {

      const search =
        searchText.toLowerCase();

      const matchesSearch =

        task.studentName
          ?.toLowerCase()
          .includes(search) ||

        task.moduleCode
          ?.toLowerCase()
          .includes(search) ||

        task.university
          ?.toLowerCase()
          .includes(search);

      const matchesTeam =

        teamFilter === "ALL" ||

        task.assignedTo?.team ===
          teamFilter;

      const matchesStatus =

        statusFilter === "ALL" ||

        task.status === statusFilter;

      return (

        matchesSearch &&

        matchesTeam &&

        matchesStatus

      );

    });

  }, [

    tasks,

    searchText,

    teamFilter,

    statusFilter,

  ]);

  //--------------------------------------------------
  // Statistics
  //--------------------------------------------------

  const statistics = useMemo(() => {

    return {

      total:
        tasks.length,

      pending:
        tasks.filter(
          (t) =>
            t.status === "PENDING"
        ).length,

      completed:
        tasks.filter(
          (t) =>
            t.status === "COMPLETED"
        ).length,

      rework:
        tasks.filter(
          (t) =>
            t.status === "REWORK"
        ).length,

      cancelled:
        tasks.filter(
          (t) =>
            t.status === "CANCELLED"
        ).length,

    };

  }, [tasks]);
  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (

    <TeamLeadLayout
      pageTitle="Assigned History"
    >

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
            sm: "repeat(2,1fr)",
            md: "repeat(3,1fr)",
            lg: "repeat(5,1fr)",
          },

          gap: 3,

          mb: 4,
        }}
      >

        {[
          {
            title: "Total Tasks",
            value: statistics.total,
            color: "#2563EB",
          },

          {
            title: "Pending",
            value: statistics.pending,
            color: "#F59E0B",
          },

          {
            title: "Completed",
            value: statistics.completed,
            color: "#16A34A",
          },

          {
            title: "Rework",
            value: statistics.rework,
            color: "#DC2626",
          },

          {
            title: "Cancelled",
            value: statistics.cancelled,
            color: "#7C3AED",
          },

        ].map((item) => (

          <Box
            key={item.title}

            sx={{
              p: 3,

              borderRadius: "24px",

              backdropFilter: "blur(18px)",

              background:
                "rgba(255,255,255,.16)",

              border:
                "1px solid rgba(255,255,255,.18)",

              boxShadow:
                "0 10px 30px rgba(15,23,42,.15)",
            }}
          >

            <Box
              sx={{
                width: 52,
                height: 52,

                borderRadius: "16px",

                bgcolor: `${item.color}20`,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                mb: 2,
              }}
            >

              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: item.color,
                }}
              />

            </Box>

            <Typography
              color="text.secondary"
            >
              {item.title}
            </Typography>

            <Typography
              mt={1}
              fontSize={32}
              fontWeight={700}
            >
              {item.value}
            </Typography>

          </Box>

        ))}

      </Box>

      {/* =======================================
               Toolbar
      ======================================= */}

      <GlassContainer>

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

          <Box
            sx={{
              display: "flex",

              flexWrap: "wrap",

              gap: 2,
            }}
          >

            <TextField
              placeholder="Search Student / Module"

              size="small"

              value={searchText}

              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }

              sx={{
                minWidth: 100,
              }}
            />

            <TextField
              select

              size="small"

              value={teamFilter}

              onChange={(e) =>
                setTeamFilter(
                  e.target.value
                )
              }

              sx={{
                minWidth: 180,
              }}
            >

              <MenuItem value="ALL">
                All Teams
              </MenuItem>

              <MenuItem value="ML">
                ML
              </MenuItem>

              <MenuItem value="DB">
                DB
              </MenuItem>

              <MenuItem value="CYBER">
                CYBER
              </MenuItem>

              <MenuItem value="GEN">
                GEN
              </MenuItem>

              <MenuItem value="WRITING">
                WRITING
              </MenuItem>

            </TextField>

            <TextField
              select

              size="small"

              value={statusFilter}

              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }

              sx={{
                minWidth: 100,
              }}
            >

              <MenuItem value="ALL">
                All Status
              </MenuItem>

              <MenuItem value="PENDING">
                Pending
              </MenuItem>

              <MenuItem value="COMPLETED">
                Completed
              </MenuItem>

              <MenuItem value="REWORK">
                Rework
              </MenuItem>

              <MenuItem value="CANCELLED">
                Cancelled
              </MenuItem>

            </TextField>

          </Box>

          <Button
            variant="contained"

            onClick={fetchAssignedTasks}

            sx={{
              borderRadius: "14px",

              textTransform: "none",

              px: 4,
            }}
          >

            Refresh

          </Button>

        </Box>
                {loading ? (

          <Box
            sx={{
              py: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />

          </Box>

        ) : (

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: "22px",

              overflow: "hidden",

              background:
                "rgba(255,255,255,.10)",

              backdropFilter: "blur(20px)",

              border:
                "1px solid rgba(255,255,255,.18)",
            }}
          >

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>
                    Student
                  </TableCell>

                  <TableCell>
                    University
                  </TableCell>

                  <TableCell>
                    Module
                  </TableCell>

                  <TableCell>
                    Assigned Employee
                  </TableCell>

                  <TableCell>
                    Team
                  </TableCell>

                  <TableCell>
                    Assigned Date
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                  <TableCell align="center">
                    Actions
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {filteredTasks.length === 0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={8}
                      align="center"
                    >

                      <Typography
                        py={5}
                        color="text.secondary"
                      >

                        No Assigned Tasks Found

                      </Typography>

                    </TableCell>

                  </TableRow>

                ) : (

                  filteredTasks.map((task) => (

                    <TableRow
                      hover
                      key={task._id}
                    >

                      <TableCell>

                        <Typography
                          fontWeight={600}
                        >
                          {task.studentName}
                        </Typography>

                      </TableCell>

                      <TableCell>

                        {task.university}

                      </TableCell>

                      <TableCell>

                        {task.moduleCode}

                      </TableCell>

                      <TableCell>

                        {task.assignedTo?.name}

                      </TableCell>

                      <TableCell>

                        <Chip
                          label={
                            task.assignedTo?.team
                          }

                          color="primary"

                          size="small"
                        />

                      </TableCell>

                      <TableCell>

                        {new Date(
                          task.createdAt
                        ).toLocaleDateString()}

                      </TableCell>

                      <TableCell>

                        <Chip

                          label={task.status}

                          size="small"

                          color={
                            task.status ===
                            "COMPLETED"

                              ? "success"

                              : task.status ===
                                "PENDING"

                              ? "warning"

                              : task.status ===
                                "REWORK"

                              ? "error"

                              : "default"
                          }

                        />

                      </TableCell>

                      <TableCell
                        align="center"
                      >

                        <Tooltip
                          title="View Details"
                        >

                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleViewTask(
                                task
                              )
                            }
                          >

                            <VisibilityRoundedIcon />

                          </IconButton>

                        </Tooltip>

                        {task.uploadedFile && (

                          <Tooltip
                            title="Download File"
                          >

                            <IconButton
                              color="success"
                              href={
                                task.uploadedFile
                              }
                              target="_blank"
                            >

                              <DownloadRoundedIcon />

                            </IconButton>

                          </Tooltip>

                        )}

                      </TableCell>

                    </TableRow>

                  ))

                )}

              </TableBody>

            </Table>

          </TableContainer>

        )}

      </GlassContainer>
            {/* ==========================================
              Task Details Dialog
      ========================================== */}

      <Dialog
        open={viewOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            backdropFilter: "blur(20px)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,.94), rgba(245,248,255,.90))",
            boxShadow:
              "0 20px 60px rgba(15,23,42,.25)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 24,
            color: "#0F172A",
          }}
        >
          Assigned Task Details
        </DialogTitle>

        <DialogContent dividers>

          {selectedTask && (

            <Grid
              container
              spacing={3}
            >

              <Grid item xs={12} md={6}>
                <Typography
                  fontWeight={700}
                >
                  Student Name
                </Typography>

                <Typography>
                  {selectedTask.studentName}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  fontWeight={700}
                >
                  University
                </Typography>

                <Typography>
                  {selectedTask.university}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  fontWeight={700}
                >
                  Module Code
                </Typography>

                <Typography>
                  {selectedTask.moduleCode}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  fontWeight={700}
                >
                  Assigned Employee
                </Typography>

                <Typography>
                  {selectedTask.assignedTo?.name}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  fontWeight={700}
                >
                  Team
                </Typography>

                <Chip
                  color="primary"
                  label={
                    selectedTask.assignedTo?.team
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  fontWeight={700}
                >
                  Status
                </Typography>

                <Chip
                  label={
                    selectedTask.status
                  }
                  color={
                    selectedTask.status ===
                    "COMPLETED"
                      ? "success"
                      : selectedTask.status ===
                        "PENDING"
                      ? "warning"
                      : selectedTask.status ===
                        "REWORK"
                      ? "error"
                      : "default"
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  fontWeight={700}
                >
                  Description
                </Typography>

                <Typography
                  sx={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedTask.description}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  fontWeight={700}
                >
                  Additional Notes
                </Typography>

                <Typography
                  sx={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedTask.additionalNotes ||
                    "No additional notes."}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  fontWeight={700}
                  mb={1}
                >
                  Uploaded File
                </Typography>

                {selectedTask.uploadedFile ? (

                  <Button
                    variant="contained"
                    color="primary"
                    href={
                      selectedTask.uploadedFile
                    }
                    target="_blank"
                    startIcon={
                      <DownloadRoundedIcon />
                    }
                  >
                    Download Attachment
                  </Button>

                ) : (

                  <Typography
                    color="text.secondary"
                  >
                    No attachment uploaded.
                  </Typography>

                )}

              </Grid>

            </Grid>

          )}

        </DialogContent>

        <DialogActions>

          <Button
            variant="contained"
            onClick={handleCloseDialog}
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

      {/* Snackbar */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
      >
        <Alert
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </TeamLeadLayout>

  );

};

export default AssignedHistory;