import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

const EmployeeToolbar = ({
  searchText,
  setSearchText,
  teamFilter,
  setTeamFilter,
  statusFilter,
  setStatusFilter,
  onRefresh,
  onAddEmployee,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mb: 1,
      }}
    >
      {/* Left Section */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          flex: 1,
        }}
      >
        {/* Search */}

        <TextField
          placeholder="Search Employee..."
          size="small"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
          sx={{
            minWidth: 280,
            background: "rgba(255,255,255,.55)",
            backdropFilter: "blur(18px)",
            borderRadius: "14px",

            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  color="primary"
                />
              </InputAdornment>
            ),
          }}
        />

        {/* Team */}

        <FormControl
          size="small"
          sx={{
            minWidth: 170,
          }}
        >
          <Select
            value={teamFilter}
            onChange={(e) =>
              setTeamFilter(
                e.target.value
              )
            }
            sx={{
              borderRadius: "14px",
              background:
                "rgba(255,255,255,.55)",
            }}
          >
            <MenuItem value="ALL">
              All Teams
            </MenuItem>

            <MenuItem value="ML">
              Machine Learning
            </MenuItem>

            <MenuItem value="DB">
              Database
            </MenuItem>

            <MenuItem value="CYBER">
              Cyber Security
            </MenuItem>

            <MenuItem value="GEN">
              General
            </MenuItem>

            <MenuItem value="WRITING">
              Writing
            </MenuItem>
          </Select>
        </FormControl>

        {/* Status */}

        <FormControl
          size="small"
          sx={{
            minWidth: 170,
          }}
        >
          <Select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            sx={{
              borderRadius: "14px",
              background:
                "rgba(255,255,255,.55)",
            }}
          >
            <MenuItem value="ALL">
              All Status
            </MenuItem>

            <MenuItem value="APPROVED">
              Approved
            </MenuItem>

            <MenuItem value="PENDING">
              Pending
            </MenuItem>

            <MenuItem value="REJECTED">
              Rejected
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Right Section */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        {/* Refresh */}

        <Tooltip title="Refresh">
          <Button
            variant="outlined"
            startIcon={
              <RefreshRoundedIcon />
            }
            onClick={onRefresh}
            sx={{
              borderRadius: "14px",
              textTransform: "none",
              px: 3,
              height: 44,
            }}
          >
            Refresh
          </Button>
        </Tooltip>

        {/* Add */}

        <Button
          variant="contained"
          startIcon={
            <PersonAddAlt1RoundedIcon />
          }
          onClick={onAddEmployee}
          sx={{
            borderRadius: "14px",
            textTransform: "none",
            px: 3.5,
            height: 44,

            background:
              "linear-gradient(90deg,#2563EB,#0EA5E9)",

            boxShadow:
              "0 8px 20px rgba(37,99,235,.25)",

            "&:hover": {
              background:
                "linear-gradient(90deg,#1D4ED8,#0284C7)",
            },
          }}
        >
          Add Employee
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeToolbar;