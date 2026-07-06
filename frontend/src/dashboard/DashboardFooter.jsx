import React from "react";

import {
  Box,
  Typography
} from "@mui/material";

const DashboardFooter = () => {

  return (

    <Box

      sx={{

        mt: 5,

        py: 3,

        textAlign: "center",

        borderTop: "1px solid #E5E7EB",

        color: "#64748B"

      }}

    >

      <Typography>

        © 2026 Employee Task Management System

      </Typography>

      <Typography

        fontSize={13}

      >

        Developed using React, Material UI and MERN Stack

      </Typography>

    </Box>

  );

};

export default DashboardFooter;