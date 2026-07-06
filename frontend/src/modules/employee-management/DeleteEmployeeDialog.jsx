import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

const DeleteEmployeeDialog = ({
  open,
  handleClose,
  employee,
  onDelete
}) => {

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >

      <DialogTitle>

        Delete Employee

      </DialogTitle>

      <DialogContent>

        <DialogContentText>

          Are you sure you want to delete

          <strong>

            {" "}

            {employee?.name}

          </strong>

          ?

          <br />

          <br />

          This action cannot be undone.

        </DialogContentText>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => {

            onDelete(employee);

            handleClose();

          }}
        >
          Delete
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default DeleteEmployeeDialog;