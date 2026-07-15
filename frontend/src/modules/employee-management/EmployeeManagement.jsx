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
import AddEmployeeDialog from "./AddEmployeeDialog";
import EditEmployeeDialog from "./EditEmployeeDialog";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";
import { useAuth } from "../../hooks/useAuth";

const EmployeeManagement = () => {
  const { user } = useAuth();
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

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  const handleAddEmployeeSuccess = () => {
    setSnackbar({
      open: true,
      severity: "success",
      message: "Employee added successfully.",
    });
    fetchEmployees();
  };

  const handleEditEmployee = (employee) => {
    setEditEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleEditEmployeeSuccess = () => {
    setSnackbar({
      open: true,
      severity: "success",
      message: "Employee updated successfully.",
    });
    fetchEmployees();
  };

  const handleDeleteEmployee = (employee) => {
    setDeleteEmployee(employee);
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEmployee = async (employee) => {
    setDeleting(true);
    setDeleteError("");
    try {
      await axiosInstance.delete(`/employees/${employee._id}`);

      setSnackbar({
        open: true,
        severity: "success",
        message: "Employee deleted successfully.",
      });

      setDeleteDialogOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error("Delete employee error:", err);
      setDeleteError(
        err?.response?.data?.message ||
          "Cannot delete employee because active records exist."
      );
    } finally {
      setDeleting(false);
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
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        emp.name?.toLowerCase().includes(searchLower) ||
        emp.employeeId?.toLowerCase().includes(searchLower) ||
        emp.email?.toLowerCase().includes(searchLower) ||
        emp.team?.toLowerCase().includes(searchLower) ||
        emp.qualification?.toLowerCase().includes(searchLower);

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

  // Get distinct teams for filter dropdown
  const distinctTeams = [
    ...new Set(employees.map((emp) => emp.team).filter(Boolean)),
  ].sort();

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
    onAddEmployee={() => setAddDialogOpen(true)}
    teams={distinctTeams}
/>

        <Box mt={3}>

           <EmployeeTable
    employees={filteredEmployees}
    onApprove={approveEmployee}
    onReject={rejectEmployee}
    onView={handleViewEmployee}
    onEdit={handleEditEmployee}
    onDelete={handleDeleteEmployee}
    currentUserId={user?._id}
    onRefresh={fetchEmployees}
    loading={loading}
/>

        </Box>

      </GlassContainer>
      <EmployeeProfile
    open={profileOpen}
    employee={selectedEmployee}
    onClose={handleCloseProfile}
/>

      <AddEmployeeDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleAddEmployeeSuccess}
        teams={distinctTeams}
      />

      <EditEmployeeDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={handleEditEmployeeSuccess}
        employee={editEmployee}
        teams={distinctTeams}
      />

      <DeleteEmployeeDialog
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        employee={deleteEmployee}
        onDelete={confirmDeleteEmployee}
        loading={deleting}
        error={deleteError}
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