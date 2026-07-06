import React from "react";

import {
  Box,
  TextField,
  Button,
  MenuItem
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

const EmployeeToolbar = () => {

  return (

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 3
      }}
    >

      {/* Left Side */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap"
        }}
      >

        <TextField
          placeholder="Search Employee..."
          size="small"
          sx={{
            width: 260
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{
                  mr: 1,
                  color: "#757575"
                }}
              />
            )
          }}
        />

        <TextField
          select
          size="small"
          defaultValue="ALL"
          sx={{
            width: 180
          }}
        >

          <MenuItem value="ALL">
            All Teams
          </MenuItem>

          <MenuItem value="ML">
            ML
          </MenuItem>

          <MenuItem value="DB">
            Database
          </MenuItem>

          <MenuItem value="CYBER">
            Cyber
          </MenuItem>

          <MenuItem value="WRITING">
            Writing
          </MenuItem>

        </TextField>

      </Box>

      {/* Right Side */}

      <Box
        sx={{
          display: "flex",
          gap: 2
        }}
      >

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Employee
        </Button>

      </Box>

    </Box>

  );

};

export default EmployeeToolbar;