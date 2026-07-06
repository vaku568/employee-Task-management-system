import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Avatar,
  Grid,
  Divider
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

const EmployeeProfile = ({
  open,
  handleClose,
  employee
}) => {

  if (!employee) return null;

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle>

        Employee Profile

      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={3}
          justifyContent="center"
        >

          <Grid
            item
            xs={12}
            textAlign="center"
          >

            <Avatar
              sx={{
                width: 90,
                height: 90,
                margin: "auto",
                bgcolor: "#1976D2"
              }}
            >

              <PersonIcon
                sx={{
                  fontSize: 55
                }}
              />

            </Avatar>

          </Grid>

          <Grid item xs={12}>

            <Divider sx={{ mb: 2 }} />

            <Typography>
              <strong>Name :</strong> {employee.name}
            </Typography>

            <Typography mt={2}>
              <strong>Email :</strong> {employee.email}
            </Typography>

            <Typography mt={2}>
              <strong>Qualification :</strong> {employee.qualification}
            </Typography>

            <Typography mt={2}>
              <strong>Team :</strong> {employee.team}
            </Typography>

            <Typography mt={2}>
              <strong>Status :</strong> {employee.status}
            </Typography>

          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={handleClose}
          variant="contained"
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default EmployeeProfile;