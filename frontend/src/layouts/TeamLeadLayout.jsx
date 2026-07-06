import { Box } from "@mui/material";

import GlassSidebar from "../components/layout/GlassSidebar";

const SIDEBAR_WIDTH = 150;

const TeamLeadLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",

        backgroundImage: "url('/office-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(8,20,48,.88), rgba(17,40,92,.82), rgba(18,74,148,.78))",
          zIndex: 0,
        },
      }}
    >
      {/* Sidebar */}

      <GlassSidebar />

      {/* Main Content */}

      <Box
        sx={{
          flex: 1,

          ml: `${SIDEBAR_WIDTH}px`,

          position: "relative",

          zIndex: 1,

          minHeight: "100vh",

          display: "flex",

          flexDirection: "column",

          overflow: "hidden",
        }}
      >
        {/* Page Content */}

        <Box
          component="main"
          sx={{
            flex: 1,

            overflowY: "auto",

            overflowX: "hidden",

            display: "flex",

            justifyContent: "center",

            alignItems: "flex-start",

            px: 3,

            py: 4,
          }}
        >
          <Box
            sx={{
              width: "100%",

              maxWidth: "1450px",

              mx: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TeamLeadLayout;