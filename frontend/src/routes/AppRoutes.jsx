import { Routes, Route, Navigate } from "react-router-dom";

/* ===========================
   Authentication
=========================== */

import RoleSelectionPage from "../modules/auth/RoleSelectionPage";
import TeamLeadLogin from "../modules/auth/TeamLeadLogin";
import EmployeeLogin from "../modules/auth/EmployeeLogin";
import EmployeeRegister from "../modules/auth/EmployeeRegister";

/* ===========================
   Layout
=========================== */

import TeamLeadLayout from "../layouts/TeamLeadLayout";

/* ===========================
   Team Lead Modules
=========================== */

import TeamLeadDashboard from "../modules/teamlead-dashboard/TeamLeadDashboard";
import EmployeeManagement from "../modules/employee-management/EmployeeManagement";
import WorkAllocation from "../modules/work-allocation/WorkAllocation";
import AssignedHistory from "../modules/assigned-history/AssignedHistory";
/*import SolutionApprovals from "../modules/solution-approvals/SolutionApprovals";*/

import TeamLeadSolutionRepository from "../modules/solutions/TeamLeadSolutionRepository";

/* ===========================
   Employee Modules
=========================== */

import EmployeeDashboard from "../modules/employee-dashboard/EmployeeDashboard";
import EmployeeSolutionRepository from "../modules/solutions/EmployeeSolutionRepository";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ===========================
          Authentication
      =========================== */}

      <Route path="/" element={<RoleSelectionPage />} />

      <Route
        path="/teamlead-login"
        element={<TeamLeadLogin />}
      />

      <Route
        path="/employee-login"
        element={<EmployeeLogin />}
      />

      <Route
        path="/employee-register"
        element={<EmployeeRegister />}
      />

      {/* ===========================
          Team Lead
      =========================== */}

      <Route
        path="/teamlead/dashboard"
        element={
          <TeamLeadLayout>
            <TeamLeadDashboard />
          </TeamLeadLayout>
        }
      />

      <Route
        path="/teamlead/employees"
        element={
          <TeamLeadLayout>
            <EmployeeManagement />
          </TeamLeadLayout>
        }
      />

      <Route
        path="/teamlead/work-allocation"
        element={
          <TeamLeadLayout>
            <WorkAllocation />
          </TeamLeadLayout>
        }
      />

      <Route
        path="/teamlead/assigned-history"
        element={
          <TeamLeadLayout>
            <AssignedHistory />
          </TeamLeadLayout>
        }
      />

     
      <Route
        path="/teamlead/solution-repository"
        element={
          <TeamLeadLayout>
            <TeamLeadSolutionRepository />
          </TeamLeadLayout>
        }
      />

      {/* ===========================
          Employee
      =========================== */}

      <Route
        path="/employee/dashboard"
        element={<EmployeeDashboard />}
      />

      <Route
        path="/employee/solution-repository"
        element={<EmployeeSolutionRepository />}
      />

      {/* ===========================
          Default
      =========================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};

export default AppRoutes;