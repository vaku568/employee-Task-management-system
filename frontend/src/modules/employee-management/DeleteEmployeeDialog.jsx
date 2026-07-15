import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

const DeleteEmployeeDialog = ({
  open,
  handleClose,
  employee,
  onDelete,
  loading,
  error,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
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
        Delete Employee
      </DialogTitle>

      <DialogContent sx={{ pt: 3, background: "rgba(255, 255, 255, 0.95)" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContentText
          sx={{
            color: "#475569",
            fontSize: 15,
          }}
        >
          Are you sure you want to delete
          <strong style={{ color: "#1E293B" }}>
            {" "}
            {employee?.name}
          </strong>
          ?
          <br />
          <br />
          This action cannot be undone.
        </DialogContentText>
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
          onClick={() => onDelete(employee)}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            background: "#DC2626",
            borderRadius: "12px",
            px: 3,
            py: 1.2,
            fontWeight: 600,
            color: "#fff",
            "&:hover": {
              background: "#B91C1C",
            },
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEmployeeDialog;