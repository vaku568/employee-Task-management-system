import React from "react";

import {
  Box,
  Typography
} from "@mui/material";

import TeamLeadLayout from "../../layouts/TeamLeadLayout";

import EmployeeToolbar from "./EmployeeToolbar";
import EmployeeTable from "./EmployeeTable";

const EmployeeManagement = () => {

  return (

    <TeamLeadLayout pageTitle="Employee Management">

      <Box>

        <Typography
          variant="h4"
          fontWeight={700}
          mb={4}
        >
          Employee Management
        </Typography>

        <EmployeeToolbar />

        <Box mt={4}>

          <EmployeeTable />

        </Box>

      </Box>

    </TeamLeadLayout>

  );

};

export default EmployeeManagement;