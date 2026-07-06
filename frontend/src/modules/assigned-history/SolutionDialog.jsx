import { useState, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Link,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";

import axiosInstance from "../../services/axiosInstance";

const SolutionDialog = ({
  open,
  onClose,
  task,
  onRefresh
}) => {

  //--------------------------------------------------
  // States
  //--------------------------------------------------

  const [loading, setLoading] =
    useState(false);

  const [solution, setSolution] =
    useState(null);

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      severity: "success",
      message: ""
    });

  //--------------------------------------------------
  // Helper Functions
  //--------------------------------------------------

  const normalizeFilePath = (
    filePath
  ) => {

    return String(filePath)
      .replace(/\\/g, "/")
      .replace(/^\//, "");

  };

  //--------------------------------------------------

  const getAttachmentUrl = (
    filePath
  ) => {

    if (!filePath) return "";

    const normalized =
      normalizeFilePath(filePath);

    const baseUrl =
      axiosInstance.defaults.baseURL
        ?.replace("/api", "") ||
      "http://localhost:5000";

    if (
      normalized.startsWith("http")
    ) {

      return normalized;

    }

    return `${baseUrl}/${normalized}`;

  };

  //--------------------------------------------------

  const isImageFile = (
    fileName
  ) => {

    const extension =
      String(fileName)
        .split(".")
        .pop()
        .toLowerCase();

    return [

      "jpg",

      "jpeg",

      "png",

      "gif",

      "webp"

    ].includes(extension);

  };

  //--------------------------------------------------
  // Fetch Solution
  //--------------------------------------------------

  const fetchSolutionForTask =
    async () => {

      if (!task?._id) return;

      try {

        setLoading(true);

        const response =
          await axiosInstance.get(
            `/solutions/task/${task._id}`
          );

        setSolution(
          response.data
        );

      } catch (error) {

        console.error(error);

        setSnackbar({

          open: true,

          severity: "error",

          message:
            error?.response?.data
              ?.message ||
            "Unable to load solution."

        });

      } finally {

        setLoading(false);

      }

    };

  //--------------------------------------------------
  // Approve Solution
  //--------------------------------------------------

  const approveSolution =
    async () => {

      if (!solution?._id) return;

      try {

        setLoading(true);

        await axiosInstance.put(

          `/solutions/${solution._id}/approve`

        );

        setSnackbar({

          open: true,

          severity: "success",

          message:
            "Solution approved successfully."

        });

        if (onRefresh) {

          onRefresh();

        }

        onClose();

      } catch (error) {

        console.error(error);

        setSnackbar({

          open: true,

          severity: "error",

          message:
            error?.response?.data
              ?.message ||
            "Unable to approve solution."

        });

      } finally {

        setLoading(false);

      }

    };

  //--------------------------------------------------
  // Rework Solution
  //--------------------------------------------------

  const reworkSolution =
    async () => {

      if (!solution?._id) return;

      try {

        setLoading(true);

        await axiosInstance.put(

          `/solutions/${solution._id}/rework`

        );

        setSnackbar({

          open: true,

          severity: "success",

          message:
            "Solution sent for rework."

        });

        if (onRefresh) {

          onRefresh();

        }

        onClose();

      } catch (error) {

        console.error(error);

        setSnackbar({

          open: true,

          severity: "error",

          message:
            error?.response?.data
              ?.message ||
            "Unable to send for rework."

        });

      } finally {

        setLoading(false);

      }

    };
      //--------------------------------------------------
  // Load Solution When Dialog Opens
  //--------------------------------------------------

  useEffect(() => {

    if (open && task) {

      fetchSolutionForTask();

    }

    if (!open) {

      setSolution(null);

    }

  }, [open, task]);

  //--------------------------------------------------
  // Render File Preview
  //--------------------------------------------------

  const renderFilePreview = (
    filePath,
    index
  ) => {

    const url =
      getAttachmentUrl(filePath);

    const fileName =
      String(filePath)
        .split("/")
        .pop();

    const lower =
      fileName.toLowerCase();

    //------------------------------------------------
    // Image Preview
    //------------------------------------------------

    if (isImageFile(fileName)) {

      return (

        <Box
          key={index}
          sx={{ mb: 2 }}
        >

          <Box
            component="img"
            src={url}
            alt={fileName}
            sx={{
              width: 220,
              maxHeight: 180,
              objectFit: "cover",
              borderRadius: 2,
              border: "1px solid #E5E7EB"
            }}
          />

          <Link
            href={url}
            target="_blank"
            underline="hover"
            sx={{
              display: "block",
              mt: 1
            }}
          >
            {fileName}
          </Link>

        </Box>

      );

    }

    //------------------------------------------------
    // PDF Preview
    //------------------------------------------------

    if (lower.endsWith(".pdf")) {

      return (

        <Paper
          key={index}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            bgcolor: "#F8FAFC"
          }}
        >

          <Typography
            fontWeight={600}
          >
            {fileName}
          </Typography>

          <Link
            href={url}
            target="_blank"
            underline="hover"
          >
            View PDF
          </Link>

        </Paper>

      );

    }

    //------------------------------------------------
    // Other Files
    //------------------------------------------------

    return (

      <Paper
        key={index}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          bgcolor: "#F8FAFC"
        }}
      >

        <Typography
          fontWeight={600}
        >
          {fileName}
        </Typography>

        <Link
          href={url}
          target="_blank"
          underline="hover"
        >
          Download File
        </Link>

      </Paper>

    );

  };

  //--------------------------------------------------
  // Dialog UI
  //--------------------------------------------------

  return (

    <>

      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >

        <DialogTitle>

          Solution Review

        </DialogTitle>

        <DialogContent dividers>

          {loading ? (

            <Box
              sx={{
                py: 8,
                display: "flex",
                justifyContent: "center"
              }}
            >

              <CircularProgress />

            </Box>

          ) : solution ? (

            <>

              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: "#F8FAFC"
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                >
                  Solution Details
                </Typography>

                <Typography>
                  <strong>
                    Employee :
                  </strong>{" "}
                  {solution.employeeId?.name}
                </Typography>

                <Typography>
                  <strong>
                    Student :
                  </strong>{" "}
                  {solution.taskId?.studentName}
                </Typography>

                <Typography>
                  <strong>
                    Module :
                  </strong>{" "}
                  {solution.taskId?.moduleCode}
                </Typography>

                <Typography>
                  <strong>
                    Solution Type :
                  </strong>{" "}
                  {solution.solutionType}
                </Typography>

                <Typography>
                  <strong>
                    Review Status :
                  </strong>{" "}
                  {solution.reviewStatus}
                </Typography>

                <Typography>
                  <strong>
                    Submitted :
                  </strong>{" "}
                  {new Date(
                    solution.submittedAt
                  ).toLocaleString()}
                </Typography>

              </Paper>

              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
              >
                Uploaded Files
              </Typography>

              {solution.files &&
              solution.files.length > 0 ? (

                solution.files.map(
                  (file, index) =>
                    renderFilePreview(
                      file,
                      index
                    )
                )

              ) : (

                <Typography
                  color="text.secondary"
                >

                  No files uploaded.

                </Typography>

              )}

            </>

          ) : (

            <Typography
              color="text.secondary"
            >

              No solution available for this task.

            </Typography>

          )}

        </DialogContent>
                <DialogActions
          sx={{
            p: 2,
            justifyContent: "space-between"
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </Button>

          <Box
            sx={{
              display: "flex",
              gap: 2
            }}
          >
            <Button
              variant="contained"
              color="error"
              disabled={
                loading ||
                !solution ||
                solution.reviewStatus === "REWORK"
              }
              onClick={reworkSolution}
            >
              Rework
            </Button>

            <Button
              variant="contained"
              color="success"
              disabled={
                loading ||
                !solution ||
                solution.reviewStatus === "APPROVED"
              }
              onClick={approveSolution}
            >
              Approve
            </Button>

          </Box>

        </DialogActions>

      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </>

  );

};

export default SolutionDialog;