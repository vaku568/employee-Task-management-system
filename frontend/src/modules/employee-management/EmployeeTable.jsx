import React, { useState } from "react";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import EmployeeProfile from "./EmployeeProfile";
import EmployeeForm from "./EmployeeForm";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";
const employees = [

  {
    id: 1,
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    team: "ML",
    qualification: "B.Tech",
    status: "Active"
  },

  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    team: "Database",
    qualification: "MCA",
    status: "Active"
  },

  {
    id: 3,
    name: "Vijay Kumar",
    email: "vijay@gmail.com",
    team: "Cyber",
    qualification: "B.Sc",
    status: "Inactive"
  },

  {
    id: 4,
    name: "Meghana",
    email: "meghana@gmail.com",
    team: "Writing",
    qualification: "MBA",
    status: "Active"
  }

];

const EmployeeTable = () => {

  const [employeeList, setEmployeeList] =
    useState(employees);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [formOpen, setFormOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

    const handleView = (employee) => {

  setSelectedEmployee(employee);

  setProfileOpen(true);

};

const handleEdit = (employee) => {

  setSelectedEmployee(employee);

  setFormOpen(true);

};

const handleDelete = (employee) => {

  setSelectedEmployee(employee);

  setDeleteOpen(true);

};

const handleSave = (updatedEmployee) => {

  const updatedEmployees = employeeList.map((emp) =>

    emp.id === updatedEmployee.id
      ? updatedEmployee
      : emp

  );

  setEmployeeList(updatedEmployees);

};

const confirmDelete = (employee) => {

  const updatedEmployees = employeeList.filter(

    (emp) => emp.id !== employee.id

  );

  setEmployeeList(updatedEmployees);

};

 return (

  <>

    <TableContainer

      component={Paper}
      sx={{
        borderRadius: 3
      }}
      
    >

      <Table>

        <TableHead>

          <TableRow
            sx={{
              background: "#1976D2"
            }}
          >

            <TableCell sx={{ color: "#FFFFFF", fontWeight: 700 }}>
              Name
            </TableCell>

            <TableCell sx={{ color: "#FFFFFF", fontWeight: 700 }}>
              Email
            </TableCell>

            <TableCell sx={{ color: "#FFFFFF", fontWeight: 700 }}>
              Team
            </TableCell>

            <TableCell sx={{ color: "#FFFFFF", fontWeight: 700 }}>
              Qualification
            </TableCell>

            <TableCell sx={{ color: "#FFFFFF", fontWeight: 700 }}>
              Status
            </TableCell>

            <TableCell
              align="center"
              sx={{ color: "#FFFFFF", fontWeight: 700 }}
            >
              Actions
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {

employeeList.map((employee) => (
              <TableRow
                key={employee.id}
                hover
              >

                <TableCell>

                  {employee.name}

                </TableCell>

                <TableCell>

                  {employee.email}

                </TableCell>

                <TableCell>

                  {employee.team}

                </TableCell>

                <TableCell>

                  {employee.qualification}

                </TableCell>

                <TableCell>

                  <Chip

                    label={employee.status}

                    color={
                      employee.status === "Active"
                        ? "success"
                        : "error"
                    }

                  />

                </TableCell>

                <TableCell align="center">

                  <IconButton
  color="primary"
  onClick={() => handleView(employee)}
>

  <VisibilityIcon />

</IconButton>

<IconButton
  color="warning"
  onClick={() => handleEdit(employee)}
>

  <EditIcon />

</IconButton>

<IconButton
  color="error"
  onClick={() => handleDelete(employee)}
>

  <DeleteIcon />

</IconButton>


                </TableCell>

              </TableRow>

            ))

          }

        </TableBody>

      </Table>
</TableContainer>
  <EmployeeProfile
    open={profileOpen}
    handleClose={() => setProfileOpen(false)}
    employee={selectedEmployee}
  />

  <EmployeeForm
    open={formOpen}
    handleClose={() => setFormOpen(false)}
    employee={selectedEmployee}
    onSave={handleSave}
  />

  <DeleteEmployeeDialog
    open={deleteOpen}
    handleClose={() => setDeleteOpen(false)}
    employee={selectedEmployee}
    onDelete={confirmDelete}
  />
</>

);

};

export default EmployeeTable;