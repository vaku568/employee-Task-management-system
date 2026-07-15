import { Box, AppBar, Toolbar, Typography } from "@mui/material";

const drawerWidth = 300;

const DashboardHeader = ({ title }) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.70)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,.35)",
        color: "#0F172A",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left Side - Page Title */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#0D3B66",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Right Side - Company Logos */}
        <Box
          component="img"
          src="/logos/company_logos.png"
          alt="Company Logo"
          sx={{
            height: 36,
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
