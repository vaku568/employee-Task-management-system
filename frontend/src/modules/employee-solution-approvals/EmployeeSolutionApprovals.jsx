import { useEffect, useMemo, useState, useCallback } from "react";

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
  Link,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

import {
  Visibility,
  Download,
} from "@mui/icons-material";

import axiosInstance from "../../services/axiosInstance";
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

const formatDate = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString();
};

const getStatusColor = (status) => {
  const colors = {
    APPROVED: "success",
    REWORK: "error",
    FINAL: "primary",
    PARAPHRASE: "secondary",
  };
  return colors[status] || "default";
};

//==================================================
// Main Component
//==================================================

const EmployeeSolutionApprovals = () => {
  //--------------------------------------------------
  // States
  //--------------------------------------------------

  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [solutionTypeFilter, setSolutionTypeFilter] = useState("ALL");
  const [submittedDateFilter, setSubmittedDateFilter] = useState(null);
  const [reviewedDateFilter, setReviewedDateFilter] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Solution Details Dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);

  //--------------------------------------------------
  // API Calls
  //--------------------------------------------------

  const fetchSolutions = useCallback(async () => {
    try {
      setLoading(true);
      console.log("[DEBUG] fetchSolutions - Calling API: /solutions/my-reviewed");
      const res = await axiosInstance.get("/solutions/my-reviewed");
      console.log("[DEBUG] fetchSolutions - API Response:", res.data);
      console.log("[DEBUG] fetchSolutions - Number of solutions received:", res.data.length);
      if (res.data.length > 0) {
        console.log("[DEBUG] fetchSolutions - First solution:", res.data[0]);
      }
      setSolutions(res.data);
    } catch (err) {
      console.error("[ERROR] fetchSolutions:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "Unable to load solutions.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  //--------------------------------------------------
  // Effects
  //--------------------------------------------------

  useEffect(() => {
    fetchSolutions();
  }, [fetchSolutions]);

  //--------------------------------------------------
  // Statistics
  //--------------------------------------------------

  const statistics = useMemo(() => {
    const totalApproved = solutions.length;
    const finalSolutions = solutions.filter((sol) => sol.solutionType === "FINAL").length;
    const paraphraseSolutions = solutions.filter((sol) => sol.solutionType === "PARAPHRASE").length;

    return {
      totalApproved,
      finalSolutions,
      paraphraseSolutions,
    };
  }, [solutions]);

  //--------------------------------------------------
  // Filters
  //--------------------------------------------------

  const filteredSolutions = useMemo(() => {
    const filtered = solutions.filter((solution) => {
      const search = searchText.toLowerCase();
      const matchesSearch =
        solution.taskId?.studentName?.toLowerCase().includes(search) ||
        solution.taskId?.moduleCode?.toLowerCase().includes(search) ||
        solution.taskId?.university?.toLowerCase().includes(search);

      const matchesType = solutionTypeFilter === "ALL" || solution.solutionType === solutionTypeFilter;

      const matchesSubmittedDate =
        !submittedDateFilter ||
        (solution.submittedAt && new Date(solution.submittedAt).toDateString() === submittedDateFilter.toDateString());

      const matchesReviewedDate =
        !reviewedDateFilter ||
        (solution.reviewedAt && new Date(solution.reviewedAt).toDateString() === reviewedDateFilter.toDateString());

      return matchesSearch && matchesType && matchesSubmittedDate && matchesReviewedDate;
    });

    console.log("[DEBUG] filteredSolutions - Total solutions:", solutions.length);
    console.log("[DEBUG] filteredSolutions - Filtered solutions:", filtered.length);
    console.log("[DEBUG] filteredSolutions - Filters:", { searchText, solutionTypeFilter, submittedDateFilter, reviewedDateFilter });

    return filtered;
  }, [solutions, searchText, solutionTypeFilter, submittedDateFilter, reviewedDateFilter]);

  const solutionTypes = useMemo(() => {
    const uniqueTypes = [...new Set(solutions.map((s) => s.solutionType).filter(Boolean))];
    return uniqueTypes.sort();
  }, [solutions]);

  //--------------------------------------------------
  // Handlers
  //--------------------------------------------------

  const handleViewSolution = useCallback((solution) => {
    setSelectedSolution(solution);
    setDetailsDialogOpen(true);
  }, []);

  const handleCloseDetailsDialog = useCallback(() => {
    setSelectedSolution(null);
    setDetailsDialogOpen(false);
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

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setSolutionTypeFilter("ALL");
    setSubmittedDateFilter(null);
    setReviewedDateFilter(null);
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

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (
    <EmployeeLayout>
      <PageHeader
        title="Solution Approvals"
        subtitle="View your approved solutions repository."
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
          },
          gap: 3,
          mb: 4,
        }}
      >
        {[
          { title: "Total Approved Solutions", value: statistics.totalApproved, color: "#2563EB" },
          { title: "Final Solutions", value: statistics.finalSolutions, color: "#7C3AED" },
          { title: "Paraphrase Solutions", value: statistics.paraphraseSolutions, color: "#F59E0B" },
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
              sx={{ minWidth: 320 }}
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
              label="Solution Type"
              value={solutionTypeFilter}
              onChange={(e) => setSolutionTypeFilter(e.target.value)}
              sx={{ minWidth: 140 }}
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              <MenuItem value="ALL">All Types</MenuItem>
              <MenuItem value="FINAL">FINAL</MenuItem>
              <MenuItem value="PARAPHRASE">PARAPHRASE</MenuItem>
            </TextField>

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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Reviewed Date"
                value={reviewedDateFilter}
                onChange={setReviewedDateFilter}
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

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ borderRadius: "14px", textTransform: "none", px: 4 }}
            >
              Reset Filters
            </Button>
            <Button
              variant="contained"
              onClick={fetchSolutions}
              sx={{ borderRadius: "14px", textTransform: "none", px: 4 }}
            >
              Refresh
            </Button>
          </Box>
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
                  <TableCell>Solution Type</TableCell>
                  <TableCell>Submitted Date</TableCell>
                  <TableCell>Approved Date</TableCell>
                  <TableCell>Files</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSolutions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography py={5} color="text.secondary">
                        No approved solutions available.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSolutions.map((solution) => (
                    <TableRow
                      hover
                      key={solution._id}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.04)",
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={600}>{solution.taskId?.studentName}</Typography>
                      </TableCell>
                      <TableCell>{solution.taskId?.university}</TableCell>
                      <TableCell>{solution.taskId?.moduleCode}</TableCell>
                      <TableCell>
                        <Chip label={solution.solutionType} color={getStatusColor(solution.solutionType)} size="small" />
                      </TableCell>
                      <TableCell>{formatDate(solution.submittedAt)}</TableCell>
                      <TableCell>{formatDate(solution.reviewedAt)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {solution.files?.length || 0} {solution.files?.length === 1 ? "File" : "Files"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton color="primary" onClick={() => handleViewSolution(solution)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download All">
                          <IconButton color="primary" onClick={() => solution.files?.forEach(handleDownloadAttachment)}>
                            <Download />
                          </IconButton>
                        </Tooltip>
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
              Solution Details Dialog
      ========================================== */}

      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
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
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, color: "#1e293b" }}>Solution Details</DialogTitle>
        <DialogContent dividers>
          {selectedSolution && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Student Name</Typography>
                <Typography>{selectedSolution.taskId?.studentName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>University</Typography>
                <Typography>{selectedSolution.taskId?.university}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Module Code</Typography>
                <Typography>{selectedSolution.taskId?.moduleCode}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={700}>Description</Typography>
                <Typography>{selectedSolution.taskId?.description || "--"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Solution Type</Typography>
                <Chip label={selectedSolution.solutionType} color={getStatusColor(selectedSolution.solutionType)} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Submitted Date</Typography>
                <Typography>{new Date(selectedSolution.submittedAt).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Approved Date</Typography>
                <Typography>{selectedSolution.reviewedAt ? new Date(selectedSolution.reviewedAt).toLocaleString() : "--"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={700} mb={2}>Uploaded Files</Typography>
                {selectedSolution.files?.length > 0 ? (
                  <Box>
                    {selectedSolution.files.map((filePath, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        {renderFilePreview(filePath, index)}
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewAttachment(filePath)}
                            startIcon={<Visibility />}
                            sx={{ borderRadius: "8px" }}
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleDownloadAttachment(filePath)}
                            startIcon={<Download />}
                            sx={{ borderRadius: "8px" }}
                          >
                            Download
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">No files uploaded.</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseDetailsDialog} sx={{ borderRadius: "12px" }}>
            Close
          </Button>
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

export default EmployeeSolutionApprovals;
