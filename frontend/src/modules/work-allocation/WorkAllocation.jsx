import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem
} from "@mui/material";

import { useState, useEffect } from "react";

import axiosInstance from "../../services/axiosInstance";

const WorkAllocation = () => {

  const [employees, setEmployees] =
    useState([]);

  const [taskData, setTaskData] =
    useState({
      studentName: "",
      university: "",
      moduleCode: "",
      description: "",
      additionalNotes: "",
      assignedTo: ""
    });

  const [file, setFile] =
    useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees =
    async () => {

      try {

        const response =
          await axiosInstance.get(
            "/employees"
          );

        const approvedEmployees =
          response.data.filter(
            employee =>
              employee.status ===
              "APPROVED"
          );

        setEmployees(
          approvedEmployees
        );

      } catch (error) {

        console.log(error);

      }

    };

  const handleChange =
    (e) => {

      setTaskData({
        ...taskData,
        [e.target.name]:
          e.target.value
      });

    };

  const createTask =
    async () => {

      try {

        const formData =
          new FormData();

        Object.keys(taskData)
          .forEach(key => {

            formData.append(
              key,
              taskData[key]
            );

          });

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

        alert(
          "Task Assigned Successfully"
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <Paper
      sx={{
        mt: 5,
        p: 3
      }}
    >

      <Typography
        variant="h5"
        mb={3}
      >
        Work Allocation
      </Typography>

      <Grid
        container
        spacing={2}
      >

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Student Name"
            name="studentName"
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="University"
            name="university"
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Module Code"
            name="moduleCode"
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Assign Employee"
            name="assignedTo"
            value={
              taskData.assignedTo
            }
            onChange={handleChange}
          >

            {employees.map(
              employee => (

                <MenuItem
                  key={
                    employee._id
                  }
                  value={
                    employee._id
                  }
                >
                  {employee.name}
                  {" - "}
                  {employee.team}
                </MenuItem>

              )
            )}

          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Additional Notes"
            name="additionalNotes"
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={createTask}
          >
            Assign Work
          </Button>
        </Grid>

      </Grid>

    </Paper>

  );

};

export default WorkAllocation;