import {
  Box,
  Paper,
  Typography
} from "@mui/material";

const LoginPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 400,
          textAlign: "center"
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
        >
          Employee Task
          Management System
        </Typography>

        <Typography>
          Powered By
        </Typography>

        <Typography>
          Sandspace Technologies
        </Typography>

        <Typography>
          TEGA
        </Typography>

        <Typography>
          Academic Overseas
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;