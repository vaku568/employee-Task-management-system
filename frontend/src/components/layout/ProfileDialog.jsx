import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../services/axiosInstance";

const ProfileDialog = ({ open, onClose }) => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    role: "",
    team: "",
    designation: "",
    status: "",
    joiningDate: "",
    createdAt: "",
    updatedAt: "",
    profilePhoto: "",
  });

  const [editData, setEditData] = useState({
    phoneNumber: "",
    email: "",
    team: "",
    designation: "",
    profilePhoto: "",
  });

  useEffect(() => {
    if (open && user?._id) {
      fetchProfile();
    }
  }, [open, user?._id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/users/profile");
      const data = res.data;
      setProfileData(data);
      setEditData({
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        team: data.team || "",
        designation: data.designation || "",
        profilePhoto: data.profilePhoto || "",
      });
    } catch (err) {
      console.error("Fetch profile error:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch profile.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      phoneNumber: profileData.phoneNumber || "",
      email: profileData.email || "",
      team: profileData.team || "",
      designation: profileData.designation || "",
      profilePhoto: profileData.profilePhoto || "",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.put("/users/profile", editData);
      const updatedUser = res.data;

      // Update AuthContext
      login(localStorage.getItem("token"), updatedUser);

      // Update local state
      setProfileData(updatedUser);
      setIsEditing(false);

      setSnackbar({
        open: true,
        message: "Profile updated successfully.",
        severity: "success",
      });
    } catch (err) {
      console.error("Update profile error:", err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to update profile.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(24px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            color: "#1E293B",
            fontSize: 20,
            fontWeight: 700,
            pb: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          Profile
        </DialogTitle>

        <DialogContent sx={{ pt: 3, background: "rgba(255, 255, 255, 0.9)" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#42A5F5" }} />
            </Box>
          ) : (
            <Box>
              {/* Profile Header */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Avatar
                  src={profileData.profilePhoto || "/favicon.svg"}
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "#42A5F5",
                    fontSize: 40,
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {profileData.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                <Typography
                  sx={{
                    color: "#1E293B",
                    fontSize: 22,
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  {profileData.name || "--"}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography
                    sx={{
                      color: "#475569",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {profileData.role || "--"}
                  </Typography>
                  <Typography sx={{ color: "#94A3B8" }}>•</Typography>
                  <Typography
                    sx={{
                      color: "#475569",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {profileData.team || "--"}
                  </Typography>
                </Box>
              </Box>

              {/* Profile Fields */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Full Name
                    </Typography>
                    <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                      {profileData.name || "--"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Employee ID
                    </Typography>
                    <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                      {profileData.employeeId || "--"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Email
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputLabel-root": { color: "#64748B" },
                          "& .MuiOutlinedInput-root": {
                            color: "#1E293B",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                            "&:hover fieldset": { borderColor: "#42A5F5" },
                            "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                          },
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                        {profileData.email || "--"}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Phone Number
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={editData.phoneNumber}
                        onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputLabel-root": { color: "#64748B" },
                          "& .MuiOutlinedInput-root": {
                            color: "#1E293B",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                            "&:hover fieldset": { borderColor: "#42A5F5" },
                            "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                          },
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                        {profileData.phoneNumber || "--"}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Role
                    </Typography>
                    <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                      {profileData.role || "--"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Team
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={editData.team}
                        onChange={(e) => setEditData({ ...editData, team: e.target.value })}
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputLabel-root": { color: "#64748B" },
                          "& .MuiOutlinedInput-root": {
                            color: "#1E293B",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                            "&:hover fieldset": { borderColor: "#42A5F5" },
                            "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                          },
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                        {profileData.team || "--"}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Designation
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={editData.designation}
                        onChange={(e) => setEditData({ ...editData, designation: e.target.value })}
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputLabel-root": { color: "#64748B" },
                          "& .MuiOutlinedInput-root": {
                            color: "#1E293B",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                            "&:hover fieldset": { borderColor: "#42A5F5" },
                            "&.Mui-focused fieldset": { borderColor: "#42A5F5" },
                          },
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                        {profileData.designation || "--"}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Status
                    </Typography>
                    <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                      {profileData.status || "--"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Joining Date
                    </Typography>
                    <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                      {formatDate(profileData.joiningDate)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Account Created
                    </Typography>
                    <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                      {formatDate(profileData.createdAt)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600, mb: 1 }}>
                      Last Updated
                    </Typography>
                    <Typography sx={{ color: "#1E293B", fontSize: 14, fontWeight: 500 }}>
                      {formatDate(profileData.updatedAt)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {isEditing ? (
            <>
              <Button
                onClick={handleCancelEdit}
                disabled={saving}
                sx={{
                  color: "#475569",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  background: "linear-gradient(135deg, #43A047, #2E7D32)",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
                  },
                }}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleEdit}
                variant="outlined"
                sx={{
                  color: "#1E293B",
                  borderColor: "rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    borderColor: "rgba(0, 0, 0, 0.3)",
                    bgcolor: "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                disabled
                sx={{
                  background: "rgba(0, 0, 0, 0.05)",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  color: "#94A3B8",
                }}
              >
                Change Password (Coming Soon)
              </Button>
              <Button
                onClick={onClose}
                sx={{
                  color: "#475569",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
                }}
              >
                Close
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ minWidth: 300 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileDialog;
