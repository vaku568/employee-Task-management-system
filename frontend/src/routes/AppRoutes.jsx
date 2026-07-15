import { Routes, Route, Navigate } from "react-router-dom";

/* ===========================
   Authentication
=========================== */

import RoleSelectionPage from "../modules/auth/RoleSelectionPage";
import TeamLeadLogin from "../modules/auth/TeamLeadLogin";
import EmployeeLogin from "../modules/auth/EmployeeLogin";
import EmployeeRegister from "../modules/auth/EmployeeRegister";
import WaitingForApproval from "../modules/auth/WaitingForApproval";
import RegistrationRejected from "../modules/auth/RegistrationRejected";

/* ===========================
   Layout
=========================== */

import TeamLeadLayout from "../layouts/TeamLeadLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

/* ===========================
   Team Lead Modules
=========================== */

import TeamLeadDashboard from "../modules/teamlead-dashboard/TeamLeadDashboard";
import EmployeeManagement from "../modules/employee-management/EmployeeManagement";
import WorkAllocation from "../modules/work-allocation/WorkAllocation";
import AssignedHistory from "../modules/assigned-history/AssignedHistory";
import SolutionApprovals from "../modules/solution-approvals/SolutionApprovals";
import TeamLeadSolutionRepository from "../modules/solutions/TeamLeadSolutionRepository";
import TeamChat from "../modules/team-chat/TeamChat";
import Notifications from "../modules/notifications/Notifications";

/* ===========================
   Employee Modules
=========================== */

import EmployeeDashboard from "../modules/employee-dashboard/EmployeeDashboard";
import AssignedWork from "../modules/assigned-work/AssignedWork";
import EmployeeSolutionApprovals from "../modules/employee-solution-approvals/EmployeeSolutionApprovals";
import EmployeeSolutionRepository from "../modules/employee-solution-repository/EmployeeSolutionRepository";
import EmployeeTeamChat from "../modules/employee-team-chat/EmployeeTeamChat";
import EmployeeNotifications from "../modules/employee-notifications/EmployeeNotifications";
import EmployeeDailyReports from "../modules/employee-reports/EmployeeDailyReports";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ===========================
          Authentication
      =========================== */}

      <Route path="/" element={<RoleSelectionPage />} />

      <Route path="/teamlead-login" element={<TeamLeadLogin />} />

      <Route path="/employee-login" element={<EmployeeLogin />} />

      <Route path="/employee-register" element={<EmployeeRegister />} />

      <Route path="/waiting-for-approval" element={<WaitingForApproval />} />

      <Route path="/registration-rejected" element={<RegistrationRejected />} />

      {/* ===========================
          TEAM LEAD ROUTES (FIXED)
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
        path="/teamlead/solution-approvals"
        element={
          <TeamLeadLayout>
            <SolutionApprovals />
          </TeamLeadLayout>
        }
      />

      {/* ✅ ONLY ONE solution repository route (FIXED) */}
      <Route
        path="/teamlead/solution-repository"
        element={
          <TeamLeadLayout>
            <TeamLeadSolutionRepository />
          </TeamLeadLayout>
        }
      />

      <Route
        path="/teamlead/chat"
        element={
          <TeamLeadLayout>
            <TeamChat />
          </TeamLeadLayout>
        }
      />

      <Route
        path="/teamlead/notifications"
        element={
          <TeamLeadLayout>
            <Notifications isTeamLead={true} />
          </TeamLeadLayout>
        }
      />

      {/* ===========================
          EMPLOYEE ROUTES
      =========================== */}

      <Route
        path="/employee/dashboard"
        element={
          <EmployeeLayout>
            <EmployeeDashboard />
          </EmployeeLayout>
        }
      />

      <Route
        path="/employee/assigned-work"
        element={
          <EmployeeLayout>
            <AssignedWork />
          </EmployeeLayout>
        }
      />

      <Route
        path="/employee/solution-approvals"
        element={
          <EmployeeLayout>
            <EmployeeSolutionApprovals />
          </EmployeeLayout>
        }
      />

      <Route
        path="/employee/solution-repository"
        element={
          <EmployeeLayout>
            <EmployeeSolutionRepository />
          </EmployeeLayout>
        }
      />

      <Route
        path="/employee/team-chat"
        element={
          <EmployeeLayout>
            <EmployeeTeamChat />
          </EmployeeLayout>
        }
      />

      <Route
        path="/employee/notifications"
        element={
          <EmployeeLayout>
            <Notifications isTeamLead={false} />
          </EmployeeLayout>
        }
      />

      <Route
        path="/employee/daily-reports"
        element={
          <EmployeeLayout>
            <EmployeeDailyReports />
          </EmployeeLayout>
        }
      />

      {/* ===========================
          DEFAULT
      =========================== */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;