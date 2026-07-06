import { Box } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const drawerWidth = 300;

const TeamLeadLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef4ff 0%, #f8fbff 55%, #e7f0ff 100%)",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default TeamLeadLayout;