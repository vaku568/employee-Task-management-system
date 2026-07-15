import { useState } from "react";
import { Box, TextField, Avatar, Typography, Chip, Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const EmployeeList = ({ employees, selectedEmployee, onSelectEmployee, currentUser }) => {
  const [searchText, setSearchText] = useState("");

  const filteredEmployees = employees.filter((employee) => {
    const search = searchText.toLowerCase();
    return (
      employee.name?.toLowerCase().includes(search) ||
      employee.employeeId?.toLowerCase().includes(search)
    );
  });

  const getTeamColor = (team) => {
    const teamColors = {
      "WRITING": "#1976D2",
      "GEN": "#43A047",
      "DB": "#FB8C00",
      "ML": "#8E24AA",
      "CYBER": "#00897B",
    };
    return teamColors[team] || "#42A5F5";
  };

  return (
    <Box
      sx={{
        width: "30%",
        borderRight: "1px solid rgba(255, 255, 255, 0.18)",
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(255, 255, 255, 0.10)",
        backdropFilter: "blur(18px)",
      }}
    >
      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search employees..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "rgba(255, 255, 255, 0.55)" }} />,
            sx: {
              borderRadius: "12px",
              bgcolor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.18)",
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "& input": {
                color: "#fff",
              },
              "& input::placeholder": {
                color: "rgba(255, 255, 255, 0.55)",
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {/* Employee List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {filteredEmployees.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
              No approved employees available.
            </Typography>
          </Box>
        ) : (
          filteredEmployees.map((employee) => (
            <Box
              key={employee._id}
              onClick={() => onSelectEmployee(employee)}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                transition: "all 0.25s ease",
                bgcolor: selectedEmployee?._id === employee._id
                  ? "rgba(255, 255, 255, 0.20)"
                  : "rgba(255, 255, 255, 0.06)",
                borderLeft: selectedEmployee?._id === employee._id
                  ? "4px solid #4DA3FF"
                  : "none",
                boxShadow: selectedEmployee?._id === employee._id
                  ? "0 8px 25px rgba(0, 0, 0, 0.18)"
                  : "none",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#42A5F5",
                  width: 48,
                  height: 48,
                }}
              >
                {employee.name?.charAt(0)?.toUpperCase() || "E"}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {employee.name}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                  <Chip
                    label={employee.team || "No Team"}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 10,
                      bgcolor: getTeamColor(employee.team),
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  />
                  {employee.employeeId && (
                    <Chip
                      label={`ID: ${employee.employeeId}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.65)",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default EmployeeList;
