import { useState, useMemo } from "react";
import { Box, TextField, Avatar, Typography, Chip, Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const UserList = ({ users, selectedUser, onSelectUser, currentUser, unreadCounts = {} }) => {
  const [searchText, setSearchText] = useState("");

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

  const getRoleColor = (role) => {
    return role === "TEAM_LEAD" ? "#4DA3FF" : "#42A5F5";
  };

  const getRoleLabel = (role) => {
    return role === "TEAM_LEAD" ? "Team Lead" : "Employee";
  };

  const filteredUsers = useMemo(() => {
    const search = searchText.toLowerCase();
    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(search) ||
        user.employeeId?.toLowerCase().includes(search) ||
        user.team?.toLowerCase().includes(search) ||
        user.role?.toLowerCase().includes(search)
      );
    });
  }, [users, searchText]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      // Sort by role: Team Leads first
      if (a.role === "TEAM_LEAD" && b.role !== "TEAM_LEAD") return -1;
      if (a.role !== "TEAM_LEAD" && b.role === "TEAM_LEAD") return 1;
      // Then alphabetically by name
      return a.name.localeCompare(b.name);
    });
  }, [filteredUsers]);

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
          placeholder="Search employees or team leads..."
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

      {/* User List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {sortedUsers.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
              No users available.
            </Typography>
          </Box>
        ) : (
          sortedUsers.map((user) => (
            <Box
              key={user._id}
              onClick={() => onSelectUser(user)}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                transition: "all 0.25s ease",
                bgcolor: selectedUser?._id === user._id
                  ? "rgba(255, 255, 255, 0.20)"
                  : "rgba(255, 255, 255, 0.06)",
                borderLeft: selectedUser?._id === user._id
                  ? "4px solid #4DA3FF"
                  : "none",
                boxShadow: selectedUser?._id === user._id
                  ? "0 8px 25px rgba(0, 0, 0, 0.18)"
                  : "none",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Badge
                badgeContent={unreadCounts[user._id] || 0}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: 11,
                    height: 18,
                    minWidth: 18,
                    bgcolor: "#FF5252",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: getRoleColor(user.role),
                    width: 48,
                    height: 48,
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              </Badge>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {user.name}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                  <Chip
                    label={getRoleLabel(user.role)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 10,
                      bgcolor: getRoleColor(user.role),
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  />
                  {user.team && (
                    <Chip
                      label={user.team}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 10,
                        bgcolor: getTeamColor(user.team),
                        color: "#FFFFFF",
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {user.employeeId && (
                    <Chip
                      label={`ID: ${user.employeeId}`}
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

export default UserList;
