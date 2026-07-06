import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem
} from "@mui/material";

const EmployeeForm = ({
  open,
  handleClose,
  employee,
  onSave
}) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    qualification: "",
    team: "",
    status: "Active"
  });

  useEffect(() => {

    if (employee) {

      setFormData(employee);

    } else {

      setFormData({
        name: "",
        email: "",
        qualification: "",
        team: "",
        status: "Active"
      });

    }

  }, [employee]);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  const handleSubmit = () => {

    onSave(formData);

    handleClose();

  };

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>

        {employee
          ? "Edit Employee"
          : "Add Employee"}

      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={2}
          mt={1}
        >

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              select
              fullWidth
              label="Team"
              name="team"
              value={formData.team}
              onChange={handleChange}
            >

              <MenuItem value="ML">
                ML
              </MenuItem>

              <MenuItem value="Database">
                Database
              </MenuItem>

              <MenuItem value="Cyber">
                Cyber
              </MenuItem>

              <MenuItem value="Writing">
                Writing
              </MenuItem>

            </TextField>

          </Grid>

          <Grid item xs={12}>

            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              <MenuItem value="Active">
                Active
              </MenuItem>

              <MenuItem value="Inactive">
                Inactive
              </MenuItem>

            </TextField>

          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Save
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default EmployeeForm;