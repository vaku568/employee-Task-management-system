import { Routes, Route } from "react-router-dom";

import RoleSelectionPage from "../modules/auth/RoleSelectionPage";
import TeamLeadLogin from "../modules/auth/TeamLeadLogin";
import EmployeeLogin from "../modules/auth/EmployeeLogin";
import EmployeeRegister from "../modules/auth/EmployeeRegister";
import TeamLeadDashboard from "../pages/teamlead/TeamLeadDashboard";
import EmployeeDashboard from "../modules/employee-dashboard/EmployeeDashboard";

import TeamLeadSolutionRepository from "../modules/solutions/TeamLeadSolutionRepository";
import EmployeeSolutionRepository from "../modules/solutions/EmployeeSolutionRepository";

const AppRoutes = () => {

  return (

    <Routes>

      <Route
        path="/"
        element={<RoleSelectionPage />}
      />

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

      <Route
        path="/teamlead-dashboard"
        element={<TeamLeadDashboard />}
      />

      <Route
  path="/teamlead/dashboard"
  element={<TeamLeadDashboard />}
/>

      <Route
        path="/teamlead-solutions"
        element={<TeamLeadSolutionRepository />}
      />

      <Route
        path="/employee-solutions"
        element={<EmployeeSolutionRepository />}
      />

    </Routes>

  );

};

export default AppRoutes;