import {
  Box,
  Grid,
  Typography,
} from "@mui/material";

import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";

const cardStyle = {
  borderRadius: "22px",

  background:
    "rgba(255,255,255,0.18)",

  backdropFilter: "blur(18px)",

  WebkitBackdropFilter:
    "blur(18px)",

  border:
    "1px solid rgba(255,255,255,.28)",

  boxShadow:
    "0 10px 28px rgba(15,23,42,.08)",

  transition: ".35s",

  p: 3,

  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow:
      "0 20px 45px rgba(37,99,235,.18)",
  },
};

const StatCard = ({
  title,
  value,
  color,
  icon,
}) => {
  return (
    <Box sx={cardStyle}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            mt={1}
            fontWeight={700}
            fontSize={30}
          >
            {value}
          </Typography>

        </Box>

        <Box
          sx={{
            width: 62,
            height: 62,
            borderRadius: "18px",

            bgcolor: `${color}15`,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            color,
          }}
        >
          {icon}
        </Box>

      </Box>
    </Box>
  );
};

const EmployeeStats = ({
  employees,
}) => {

  const total =
    employees.length;

  const approved =
    employees.filter(
      (e) =>
        e.status === "APPROVED"
    ).length;

  const pending =
    employees.filter(
      (e) =>
        e.status === "PENDING"
    ).length;

  const rejected =
    employees.filter(
      (e) =>
        e.status === "REJECTED"
    ).length;

  const ml =
    employees.filter(
      (e) => e.team === "ML"
    ).length;

  const db =
    employees.filter(
      (e) => e.team === "DB"
    ).length;

  const cyber =
    employees.filter(
      (e) =>
        e.team === "CYBER"
    ).length;

  const gen =
    employees.filter(
      (e) =>
        e.team === "GEN"
    ).length;

  const writing =
    employees.filter(
      (e) =>
        e.team ===
        "WRITING"
    ).length;

  const stats = [

    {
      title:
        "Total Employees",
      value: total,
      color: "#2563EB",
      icon:
        <PeopleRoundedIcon fontSize="large" />,
    },

    {
      title:
        "Approved",
      value: approved,
      color: "#16A34A",
      icon:
        <CheckCircleRoundedIcon fontSize="large" />,
    },

    {
      title:
        "Pending",
      value: pending,
      color: "#F59E0B",
      icon:
        <PendingRoundedIcon fontSize="large" />,
    },

    {
      title:
        "Rejected",
      value: rejected,
      color: "#DC2626",
      icon:
        <CancelRoundedIcon fontSize="large" />,
    },

    {
      title:
        "ML Team",
      value: ml,
      color: "#3B82F6",
      icon:
        <MemoryRoundedIcon fontSize="large" />,
    },

    {
      title:
        "DB Team",
      value: db,
      color: "#6366F1",
      icon:
        <StorageRoundedIcon fontSize="large" />,
    },

    {
      title:
        "Cyber",
      value: cyber,
      color: "#8B5CF6",
      icon:
        <SecurityRoundedIcon fontSize="large" />,
    },

    {
      title:
        "GEN",
      value: gen,
      color: "#06B6D4",
      icon:
        <MenuBookRoundedIcon fontSize="large" />,
    },

    {
      title:
        "Writing",
      value: writing,
      color: "#EC4899",
      icon:
        <EditNoteRoundedIcon fontSize="large" />,
    },

  ];

  return (

    <Grid
      container
      spacing={3}
      mb={4}
    >

      {stats.map((item) => (

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={4}
          xl={4}
          key={item.title}
        >

          <StatCard {...item} />

        </Grid>

      ))}

    </Grid>

  );
};

export default EmployeeStats;