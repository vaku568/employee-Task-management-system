import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
} from "@mui/material";

import axiosInstance from "../../services/axiosInstance";

import TeamLeadLayout from "../../layouts/TeamLeadLayout";

import PageHeader from "../../components/layout/PageHeader";
import GlassContainer from "../../components/layout/GlassContainer";

import EmployeeStats from "./EmployeeStats";
import EmployeeToolbar from "./EmployeeToolbar";
import EmployeeTable from "./EmployeeTable";
import EmployeeProfile from "./EmployeeProfile";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] =
    useState("");

  const [teamFilter, setTeamFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      severity: "success",
      message: "",
    });
    const [profileOpen, setProfileOpen] = useState(false);

const [selectedEmployee, setSelectedEmployee] = useState(null);

  //----------------------------------------------------
  // Fetch Employees
  //----------------------------------------------------

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res =
        await axiosInstance.get("/employees");

      setEmployees(res.data);
    } catch (err) {
      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          err?.response?.data?.message ||
          "Unable to load employees.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  //----------------------------------------------------
  // Approve
  //----------------------------------------------------

  const approveEmployee = async (id) => {
    try {
      await axiosInstance.put(
        `/employees/${id}/approve`
      );

      setSnackbar({
        open: true,
        severity: "success",
        message:
          "Employee approved successfully.",
      });

      fetchEmployees();
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err?.response?.data?.message ||
          "Approval failed.",
      });
    }
  };

  //----------------------------------------------------
  // Reject
  //----------------------------------------------------

  const rejectEmployee = async (id) => {
    try {
      await axiosInstance.put(
        `/employees/${id}/reject`
      );

      setSnackbar({
        open: true,
        severity: "success",
        message:
          "Employee rejected successfully.",
      });

      fetchEmployees();
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err?.response?.data?.message ||
          "Reject failed.",
      });
    }
  };

  //----------------------------------------------------
  // Filter Data
  //----------------------------------------------------

  const filteredEmployees =
    employees.filter((emp) => {
      const matchesSearch =
        emp.name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        emp.employeeId
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesTeam =
        teamFilter === "ALL" ||
        emp.team === teamFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        emp.status === statusFilter;
 

      return (
        matchesSearch &&
        matchesTeam &&
        matchesStatus
      );
    });

         //----------------------------------------------------
// View Employee
//----------------------------------------------------

const handleViewEmployee = (employee) => {
  setSelectedEmployee(employee);
  setProfileOpen(true);
};

const handleCloseProfile = () => {
  setProfileOpen(false);
  setSelectedEmployee(null);
};

  return (
    <TeamLeadLayout
      pageTitle="Employee Management"
    >
      <PageHeader
        title="Employee Management"
        subtitle="Manage employee registrations, approvals and team information."
      />

      <EmployeeStats
        employees={employees}
      />

      <GlassContainer>

      <EmployeeToolbar
    searchText={searchText}
    setSearchText={setSearchText}
    teamFilter={teamFilter}
    setTeamFilter={setTeamFilter}
    statusFilter={statusFilter}
    setStatusFilter={setStatusFilter}
    onRefresh={fetchEmployees}
    onAddEmployee={() =>
      console.log("Open Employee Form")
    }
/>

        <Box mt={3}>

          {loading ? (
            <Box
              sx={{
                py: 10,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
           <EmployeeTable
    employees={filteredEmployees}
    onApprove={approveEmployee}
    onReject={rejectEmployee}
    onView={handleViewEmployee}
/>

          )}

        </Box>

      </GlassContainer>
      <EmployeeProfile
    open={profileOpen}
    employee={selectedEmployee}
    onClose={handleCloseProfile}
/>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
      >
        <Alert
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </TeamLeadLayout>
  );
};

export default EmployeeManagement;