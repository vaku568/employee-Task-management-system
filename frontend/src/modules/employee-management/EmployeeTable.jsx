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
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

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

          {employees.length === 0 ? (
            <TableRow>

              <TableCell
                colSpan={6}
                align="center"
              >
                <Typography
                  sx={{
                    py: 5,
                  }}
                >
                  No employees found.
                </Typography>

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

                  <TableCell>

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

                      <Box>

                        <Typography
                          fontWeight={
                            600
                          }
                        >
                          {
                            employee.name
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
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

                    <Tooltip title="Edit">

                      <IconButton
                        color="primary"
                      >
                        <EditRoundedIcon />

                      </IconButton>

                    </Tooltip>

                    <Tooltip title="Delete">

                      <IconButton
                        color="error"
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