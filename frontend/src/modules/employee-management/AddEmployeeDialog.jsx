import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const AddEmployeeDialog = ({ open, onClose, onSuccess, teams }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    qualification: "",
    team: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    }

    if (!formData.qualification.trim()) {
      newErrors.qualification = "Qualification is required";
    }

    if (!formData.team) {
      newErrors.team = "Team is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await axiosInstance.post("/employees/register", submitData);

      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Add employee error:", err);
      setErrors({
        submit: err?.response?.data?.message || "Failed to add employee",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      qualification: "",
      team: "",
      designation: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "rgba(255, 255, 255, 0.98)",
          color: "#1E293B",
          fontSize: 20,
          fontWeight: 700,
          pb: 2,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        Add New Employee
      </DialogTitle>

      <DialogContent sx={{ pt: 3, background: "rgba(255, 255, 255, 0.95)" }}>
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputLabel-root": { color: "#64748B" },
                  "& .MuiOutlinedInput-root": {
                    color: "#1E293B",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                    "&:hover fieldset": { borderColor: "#42A5F5" },
                    "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputLabel-root": { color: "#64748B" },
                  "& .MuiOutlinedInput-root": {
                    color: "#1E293B",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                    "&:hover fieldset": { borderColor: "#42A5F5" },
                    "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputLabel-root": { color: "#64748B" },
                  "& .MuiOutlinedInput-root": {
                    color: "#1E293B",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                    "&:hover fieldset": { borderColor: "#42A5F5" },
                    "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="qualification"
                label="Qualification"
                value={formData.qualification}
                onChange={handleChange}
                error={!!errors.qualification}
                helperText={errors.qualification}
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputLabel-root": { color: "#64748B" },
                  "& .MuiOutlinedInput-root": {
                    color: "#1E293B",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                    "&:hover fieldset": { borderColor: "#42A5F5" },
                    "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" error={!!errors.team}>
                <InputLabel sx={{ color: "#64748B" }}>Team</InputLabel>
                <Select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  label="Team"
                  sx={{
                    color: "#1E293B",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#42A5F5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#42A5F5",
                    },
                  }}
                >
                  {teams.map((team) => (
                    <MenuItem key={team} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </Select>
                {errors.team && (
                  <Box sx={{ color: "#DC2626", fontSize: 12, mt: 0.5 }}>
                    {errors.team}
                  </Box>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="designation"
                label="Designation"
                value={formData.designation}
                onChange={handleChange}
                error={!!errors.designation}
                helperText={errors.designation}
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputLabel-root": { color: "#64748B" },
                  "& .MuiOutlinedInput-root": {
                    color: "#1E293B",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                    "&:hover fieldset": { borderColor: "#42A5F5" },
                    "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputLabel-root": { color: "#64748B" },
                  "& .MuiOutlinedInput-root": {
                    color: "#1E293B",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                    "&:hover fieldset": { borderColor: "#42A5F5" },
                    "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputLabel-root": { color: "#64748B" },
                  "& .MuiOutlinedInput-root": {
                    color: "#1E293B",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                    "&:hover fieldset": { borderColor: "#42A5F5" },
                    "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                  },
                }}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          background: "rgba(255, 255, 255, 0.98)",
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: "#475569",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
            borderRadius: "12px",
            px: 3,
            py: 1.2,
            fontWeight: 600,
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(135deg, #1D4ED8, #0284C7)",
            },
          }}
        >
          {loading ? "Adding..." : "Add Employee"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;
