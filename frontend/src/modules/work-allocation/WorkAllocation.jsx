import { useEffect, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";

import axiosInstance from "../../services/axiosInstance";

import TeamLeadLayout from "../../layouts/TeamLeadLayout";

import PageHeader from "../../components/layout/PageHeader";
import GlassContainer from "../../components/layout/GlassContainer";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",

    background: "rgba(255,255,255,.55)",

    backdropFilter: "blur(15px)",

    "& fieldset": {
      borderColor: "rgba(255,255,255,.20)",
    },

    "&:hover fieldset": {
      borderColor: "#1976d2",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      borderWidth: "2px",
    },
  },
};

const WorkAllocation = () => {
  const fileInputRef = useRef(null);

  const initialState = {
    studentName: "",
    university: "",
    moduleCode: "",
    description: "",
    additionalNotes: "",
    assignedTo: "",
  };

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [assigning, setAssigning] = useState(false);

  const [file, setFile] = useState(null);

  const [taskData, setTaskData] =
    useState(initialState);

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      severity: "success",
      message: "",
    });

  //----------------------------------
  // Fetch Employees
  //----------------------------------

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res =
        await axiosInstance.get("/employees");

      const approved =
        res.data.filter(
          (emp) =>
            emp.status === "APPROVED"
        );

      setEmployees(approved);
    } catch (error) {
      console.log(error);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Unable to load employees.",
      });
    } finally {
      setLoading(false);
    }
  };

  //----------------------------------
  // Handle Input
  //----------------------------------

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]:
        e.target.value,
    });
  };

  //----------------------------------
  // Assign Task
  //----------------------------------

  const createTask = async () => {
    try {
      setAssigning(true);

      const formData =
        new FormData();

      Object.keys(taskData).forEach(
        (key) => {
          formData.append(
            key,
            taskData[key]
          );
        }
      );

      if (file) {
        formData.append(
          "file",
          file
        );
      }

      await axiosInstance.post(
        "/tasks",
        formData
      );

      //--------------------------------
      // Reset Form
      //--------------------------------

      setTaskData(initialState);

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      //--------------------------------

      setSnackbar({
        open: true,
        severity: "success",
        message:
          "Work Assigned Successfully.",
      });
    } catch (error) {
      console.log(error);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data
            ?.message ||
          "Unable to assign work.",
      });
    } finally {
      setAssigning(false);
    }
  };

  return (
    <TeamLeadLayout pageTitle="Work Allocation">
      <PageHeader
        title="Work Allocation"
        subtitle="Assign academic work to approved employees."
      />

      <GlassContainer>
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
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Student Name"
                name="studentName"
                value={
                  taskData.studentName
                }
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="University"
                name="university"
                value={
                  taskData.university
                }
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Module Code"
                name="moduleCode"
                value={
                  taskData.moduleCode
                }
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                select
                label="Assign Employee"
                name="assignedTo"
                value={
                  taskData.assignedTo
                }
                onChange={handleChange}
                sx={textFieldStyle}
              >
                {employees.map(
                  (employee) => (
                    <MenuItem
                      key={
                        employee._id
                      }
                      value={
                        employee._id
                      }
                    >
                      {employee.name}
                      {" • "}
                      {employee.team}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

                        <Grid
              item
              xs={12}
            >
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Task Description"
                name="description"
                value={taskData.description}
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid
              item
              xs={12}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Notes"
                name="additionalNotes"
                value={taskData.additionalNotes}
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Upload Section */}

            <Grid
              item
              xs={12}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,

                  borderRadius: "20px",

                  textAlign: "center",

                  background:
                    "rgba(255,255,255,.40)",

                  backdropFilter:
                    "blur(18px)",

                  border:
                    "2px dashed rgba(25,118,210,.35)",

                  transition:
                    ".35s ease",

                  "&:hover": {
                    borderColor:
                      "#1976D2",

                    background:
                      "rgba(255,255,255,.55)",
                  },
                }}
              >
                <CloudUploadRoundedIcon
                  sx={{
                    fontSize: 46,
                    color: "#1976D2",
                    mb: 1,
                  }}
                />

                <Typography
                  fontWeight={700}
                  mb={1}
                >
                  Upload Task File
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={2}
                >
                  PDF, DOCX, ZIP,
                  Images...
                </Typography>

                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    borderRadius: "14px",
                    textTransform: "none",
                  }}
                >
                  Choose File

                  <input
                    hidden
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) =>
                      setFile(
                        e.target.files[0]
                      )
                    }
                  />
                </Button>

                {file && (
                  <Typography
                    mt={2}
                    color="primary"
                    fontWeight={600}
                  >
                    {file.name}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Button */}

            <Grid
              item
              xs={12}
            >
              <Box
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    assigning ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <AssignmentTurnedInRoundedIcon />
                    )
                  }
                  disabled={assigning}
                  onClick={createTask}
                  sx={{
                    minWidth: 220,

                    height: 52,

                    borderRadius:
                      "15px",

                    textTransform:
                      "none",

                    fontWeight: 700,

                    fontSize: 16,

                    background:
                      "linear-gradient(90deg,#2563EB,#0EA5E9)",

                    boxShadow:
                      "0 10px 30px rgba(37,99,235,.30)",

                    "&:hover": {
                      background:
                        "linear-gradient(90deg,#1D4ED8,#0284C7)",
                    },
                  }}
                >
                  {assigning
                    ? "Assigning..."
                    : "Assign Work"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </GlassContainer>

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
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </TeamLeadLayout>
  );
};

export default WorkAllocation;