import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

const statusColor = (status) => {
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

const DetailItem = ({
  icon,
  label,
  value,
}) => (
  <Grid
    item
    xs={12}
    md={6}
  >
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        p: 2,
        borderRadius: "14px",
        bgcolor: "rgba(255,255,255,.35)",
      }}
    >
      <Box color="primary.main">
        {icon}
      </Box>

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {label}
        </Typography>

        <Typography
          fontWeight={600}
        >
          {value || "-"}
        </Typography>
      </Box>
    </Box>
  </Grid>
);

const EmployeeProfile = ({
  open,
  employee,
  onClose,
}) => {
  if (!employee) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "24px",

          background:
            "rgba(255,255,255,.18)",

          backdropFilter:
            "blur(25px)",

          border:
            "1px solid rgba(255,255,255,.25)",

          overflow: "hidden",
        },
      }}
    >
      {/* Header */}

      <DialogTitle
        sx={{
          pb: 1,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Employee Profile
          </Typography>

          <IconButton
            onClick={onClose}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {/* Profile */}

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={4}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "#2563EB",
              fontSize: 36,
              fontWeight: 700,
              mb: 2,
            }}
          >
            {employee.name
              ?.charAt(0)
              .toUpperCase()}
          </Avatar>

          <Typography
            variant="h5"
            fontWeight={700}
          >
            {employee.name}
          </Typography>

          <Typography
            color="text.secondary"
          >
            {employee.email}
          </Typography>

          <Chip
            sx={{ mt: 2 }}
            color={statusColor(employee.status)}
            label={employee.status}
          />
        </Box>

        {/* Details */}

        <Grid
          container
          spacing={2}
        >
          <DetailItem
            icon={<BadgeRoundedIcon />}
            label="Employee ID"
            value={employee.employeeId}
          />

          <DetailItem
            icon={<EmailRoundedIcon />}
            label="Email"
            value={employee.email}
          />

          <DetailItem
            icon={<GroupsRoundedIcon />}
            label="Team"
            value={employee.team}
          />

          <DetailItem
            icon={<SchoolRoundedIcon />}
            label="Qualification"
            value={employee.qualification}
          />

          <DetailItem
            icon={<PersonRoundedIcon />}
            label="Role"
            value={employee.role}
          />

          <DetailItem
            icon={<CalendarMonthRoundedIcon />}
            label="Created"
            value={
              employee.createdAt
                ? new Date(
                    employee.createdAt
                  ).toLocaleDateString()
                : "-"
            }
          />

          <DetailItem
            icon={<CalendarMonthRoundedIcon />}
            label="Updated"
            value={
              employee.updatedAt
                ? new Date(
                    employee.updatedAt
                  ).toLocaleDateString()
                : "-"
            }
          />
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeProfile;