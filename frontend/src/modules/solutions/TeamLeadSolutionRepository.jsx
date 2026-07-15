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
  Link,
  InputLabel,
  Select,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

import {
  Visibility,
  Download,
} from "@mui/icons-material";

import axiosInstance from "../../services/axiosInstance";
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

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

//==================================================
// Component
//==================================================

const TeamLeadSolutionRepository = () => {
  //--------------------------------------------------
  // States
  //--------------------------------------------------

  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [employeeFilter, setEmployeeFilter] = useState("ALL");
  const [solutionTypeFilter, setSolutionTypeFilter] = useState("ALL");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("ALL");
  const [fromDateFilter, setFromDateFilter] = useState(null);
  const [toDateFilter, setToDateFilter] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Solution Details Dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);

  const currentUser = useRef(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  ).current;

  //--------------------------------------------------
  // Fetch Solutions
  //--------------------------------------------------

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/solutions");
      setSolutions(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "Unable to load solutions.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  //--------------------------------------------------
  // Filter Solutions
  //--------------------------------------------------

  const filteredSolutions = useMemo(() => {
    return solutions.filter((solution) => {
      const search = searchText.toLowerCase();
      const matchesSearch =
        solution.taskId?.studentName?.toLowerCase().includes(search) ||
        solution.employeeId?.name?.toLowerCase().includes(search) ||
        solution.taskId?.moduleCode?.toLowerCase().includes(search) ||
        solution.taskId?.university?.toLowerCase().includes(search);

      const matchesTeam = teamFilter === "ALL" || solution.employeeId?.team === teamFilter;
      const matchesType = solutionTypeFilter === "ALL" || solution.solutionType === solutionTypeFilter;
      const matchesStatus = reviewStatusFilter === "ALL" || solution.reviewStatus === reviewStatusFilter;
      const matchesEmployee = employeeFilter === "ALL" || solution.employeeId?._id === employeeFilter;

      const solutionDate = solution.submittedAt || solution.createdAt;
      const matchesFromDate =
        !fromDateFilter ||
        new Date(solutionDate) >= fromDateFilter;

      const matchesToDate =
        !toDateFilter ||
        new Date(solutionDate) <= toDateFilter;

      return matchesSearch && matchesTeam && matchesType && matchesStatus && matchesEmployee && matchesFromDate && matchesToDate;
    });
  }, [solutions, searchText, teamFilter, solutionTypeFilter, reviewStatusFilter, employeeFilter, fromDateFilter, toDateFilter]);

  const teams = useMemo(() => {
    const uniqueTeams = [...new Set(solutions.map((s) => s.employeeId?.team).filter(Boolean))];
    return uniqueTeams.sort();
  }, [solutions]);

  const solutionTypes = useMemo(() => {
    const uniqueTypes = [...new Set(solutions.map((s) => s.solutionType).filter(Boolean))];
    return uniqueTypes.sort();
  }, [solutions]);

  const reviewStatuses = useMemo(() => {
    const uniqueStatuses = [...new Set(solutions.map((s) => s.reviewStatus).filter(Boolean))];
    return uniqueStatuses.sort();
  }, [solutions]);

  const employees = useMemo(() => {
    const uniqueEmployees = [...new Set(solutions.map((s) => s.employeeId).filter(Boolean))];
    return uniqueEmployees.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [solutions]);

  //--------------------------------------------------
  // Statistics
  //--------------------------------------------------

  const statistics = useMemo(() => {
    return {
      total: solutions.length,
      approved: solutions.filter((s) => s.reviewStatus === "APPROVED").length,
      rework: solutions.filter((s) => s.reviewStatus === "REWORK").length,
      paraphrase: solutions.filter((s) => s.solutionType === "PARAPHRASE").length,
      final: solutions.filter((s) => s.solutionType === "FINAL").length,
    };
  }, [solutions]);

  //--------------------------------------------------
  // Handlers
  //--------------------------------------------------

  const handleViewSolution = useCallback((solution) => {
    setSelectedSolution(solution);
    setDetailsDialogOpen(true);
  }, []);

  const handleCloseDetailsDialog = useCallback(() => {
    setDetailsDialogOpen(false);
    setSelectedSolution(null);
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

  const getReviewStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REWORK":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (
    <TeamLeadLayout pageTitle="Solution Repository">
      <PageHeader
        title="Solution Repository"
        subtitle="View and manage all submitted solutions from employees."
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
          { title: "Total Solutions", value: statistics.total, color: "#2563EB" },
          { title: "Approved Solutions", value: statistics.approved, color: "#16A34A" },
          { title: "Rework Solutions", value: statistics.rework, color: "#DC2626" },
          { title: "Paraphrase Solutions", value: statistics.paraphrase, color: "#F59E0B" },
          { title: "Final Solutions", value: statistics.final, color: "#7C3AED" },
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
              placeholder="Search Student / Employee / Module / University"
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
              label="Employee"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              sx={{ minWidth: 160 }}
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              <MenuItem value="ALL">All Employees</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name}
                </MenuItem>
              ))}
            </TextField>

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
              {solutionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Review Status"
              value={reviewStatusFilter}
              onChange={(e) => setReviewStatusFilter(e.target.value)}
              sx={{ minWidth: 140 }}
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              <MenuItem value="ALL">All Status</MenuItem>
              {reviewStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={fromDateFilter}
                onChange={setFromDateFilter}
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
                label="To Date"
                value={toDateFilter}
                onChange={setToDateFilter}
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
            onClick={fetchSolutions}
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
                  <TableCell>Team</TableCell>
                  <TableCell>University</TableCell>
                  <TableCell>Module Code</TableCell>
                  <TableCell>Solution Type</TableCell>
                  <TableCell>Review Status</TableCell>
                  <TableCell>Submitted Date</TableCell>
                  <TableCell>Reviewed Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSolutions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography py={5} color="text.secondary">
                        No Solutions Found
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
                      <TableCell>{solution.employeeId?.name}</TableCell>
                      <TableCell>
                        <Chip label={solution.employeeId?.team} color="primary" size="small" />
                      </TableCell>
                      <TableCell>{solution.taskId?.university}</TableCell>
                      <TableCell>{solution.taskId?.moduleCode}</TableCell>
                      <TableCell>
                        <Chip label={solution.solutionType} color="secondary" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={solution.reviewStatus} size="small" color={getReviewStatusColor(solution.reviewStatus)} />
                      </TableCell>
                      <TableCell>{formatDate(solution.submittedAt)}</TableCell>
                      <TableCell>{formatDate(solution.reviewedAt)}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton color="primary" onClick={() => handleViewSolution(solution)}>
                            <Visibility />
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
                <Typography fontWeight={700}>Employee Name</Typography>
                <Typography>{selectedSolution.employeeId?.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Team</Typography>
                <Chip label={selectedSolution.employeeId?.team} color="primary" size="small" />
              </Grid>
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
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Solution Type</Typography>
                <Chip label={selectedSolution.solutionType} color="secondary" size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Review Status</Typography>
                <Chip label={selectedSolution.reviewStatus} size="small" color={getReviewStatusColor(selectedSolution.reviewStatus)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Submitted Date</Typography>
                <Typography>{formatDate(selectedSolution.submittedAt)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Reviewed Date</Typography>
                <Typography>{formatDate(selectedSolution.reviewedAt)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={700} mb={2}>Uploaded Files</Typography>
                {selectedSolution.files?.length > 0 ? (
                  selectedSolution.files.map((file, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                        {String(file).split("/").pop()}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleViewAttachment(file)}
                          startIcon={<Visibility />}
                          sx={{ borderRadius: "12px" }}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDownloadAttachment(file)}
                          startIcon={<Download />}
                          sx={{ borderRadius: "12px" }}
                        >
                          Download
                        </Button>
                      </Box>
                    </Box>
                  ))
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
    </TeamLeadLayout>
  );
};

export default TeamLeadSolutionRepository;