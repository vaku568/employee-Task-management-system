import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";

const getStatusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "success";

    case "PENDING":
      return "warning";

    case "REJECTED":
      return "error";

    default:
      return "default";
  }
};

const EmployeeTable = ({
    employees,
    onApprove,
    onReject,
    onView,
    onEdit,
    onDelete,
    currentUserId,
    onRefresh,
    loading,
}) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        background:
          "rgba(255,255,255,.16)",

        backdropFilter: "blur(18px)",

        WebkitBackdropFilter:
          "blur(18px)",

        border:
          "1px solid rgba(255,255,255,.25)",

        borderRadius: "22px",

        overflow: "hidden",
      }}
    >
      <Table>

        {/* HEADER */}

        <TableHead>

          <TableRow
            sx={{
              bgcolor:
                "rgba(255,255,255,.18)",
            }}
          >
            <TableCell>
              Employee
            </TableCell>

            <TableCell>
              Employee ID
            </TableCell>

            <TableCell>
              Team
            </TableCell>

            <TableCell>
              Qualification
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell
              align="center"
            >
              Actions
            </TableCell>

          </TableRow>

        </TableHead>

        {/* BODY */}

        <TableBody>

          {loading ? (
            // Skeleton loader
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ width: "100%" }}>
                      <Skeleton variant="text" width={120} height={20} />
                      <Skeleton variant="text" width={180} height={16} />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} height={20} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rectangular" width={80} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} height={20} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rectangular" width={80} height={24} />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : employees.length === 0 ? (
            <TableRow>

              <TableCell
                colSpan={6}
                align="center"
              >
                <Box
                  sx={{
                    py: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <PersonOffRoundedIcon
                    sx={{
                      fontSize: 80,
                      color: "rgba(255, 255, 255, 0.3)",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontWeight: 600,
                    }}
                  >
                    No employees found
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshRoundedIcon />}
                    onClick={onRefresh}
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Refresh
                  </Button>
                </Box>

              </TableCell>

            </TableRow>
          ) : (
            employees.map(
              (employee) => (
                <TableRow
                  key={
                    employee._id
                  }
                  hover
                  sx={{
                    transition:
                      ".25s",

                    "&:hover": {
                      bgcolor:
                        "rgba(37,99,235,.05)",
                    },
                  }}
                >
                  {/* Employee */}

                  <TableCell sx={{ minWidth: 250 }}>

                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Avatar
                        sx={{
                          bgcolor:
                            "#2563EB",
                        }}
                      >
                        {employee.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>

                        <Typography
                          fontWeight={
                            600
                          }
                          noWrap
                        >
                          {
                            employee.name
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            wordBreak: "break-all",
                            display: "block",
                          }}
                        >
                          {
                            employee.email
                          }
                        </Typography>

                      </Box>

                    </Box>

                  </TableCell>

                  {/* Employee ID */}

                  <TableCell>

                    {
                      employee.employeeId
                    }

                  </TableCell>

                  {/* Team */}

                  <TableCell>

                    <Chip
                      label={
                        employee.team
                      }
                      color="primary"
                      variant="outlined"
                    />

                  </TableCell>

                  {/* Qualification */}

                  <TableCell>

                    {
                      employee.qualification
                    }

                  </TableCell>

                  {/* Status */}

                  <TableCell>

                    <Chip
                      label={
                        employee.status
                      }
                      color={getStatusColor(
                        employee.status
                      )}
                    />

                  </TableCell>

                  {/* Actions */}

                  <TableCell
                    align="center"
                  >
                    <Tooltip title="View Profile">

                  <IconButton
    color="primary"
    onClick={() => onView(employee)}
>
    <VisibilityRoundedIcon />
</IconButton>

                    </Tooltip>

                    {employee.status ===
                      "PENDING" && (
                      <>
                        <Tooltip title="Approve">

                          <IconButton
                            color="success"
                            onClick={() =>
                              onApprove(
                                employee._id
                              )
                            }
                          >
                            <CheckCircleRoundedIcon />

                          </IconButton>

                        </Tooltip>

                        <Tooltip title="Reject">

                          <IconButton
                            color="error"
                            onClick={() =>
                              onReject(
                                employee._id
                              )
                            }
                          >
                            <CancelRoundedIcon />

                          </IconButton>

                        </Tooltip>
                      </>
                    )}

                    <Tooltip title="Edit Employee">

                      <IconButton
                        color="primary"
                        onClick={() => onEdit(employee)}
                        sx={{
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.2)",
                          },
                        }}
                      >
                        <EditRoundedIcon />

                      </IconButton>

                    </Tooltip>

                    <Tooltip title="Delete Employee">

                      <IconButton
                        color="error"
                        onClick={() => onDelete(employee)}
                        disabled={currentUserId === employee._id}
                        sx={{
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.2)",
                          },
                          "&:disabled": {
                            opacity: 0.3,
                          },
                        }}
                      >
                        <DeleteRoundedIcon />

                      </IconButton>

                    </Tooltip>

                  </TableCell>

                </TableRow>
              )
            )
          )}

        </TableBody>

      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;