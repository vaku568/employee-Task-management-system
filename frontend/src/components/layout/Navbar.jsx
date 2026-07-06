import {
  AppBar,
  Toolbar,
  Typography,
  Box
} from "@mui/material";

const Navbar = () => {

  return (

    <AppBar
      position="static"
      elevation={1}
      sx={{
        background: "#FFFFFF",
        color: "#0D3B66"
      }}
    >

      <Toolbar>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            flexGrow: 1
          }}
        >
          Employee Task
          Management System
        </Typography>

        <Box
          component="img"
          src="/logos/company_logos.png"
          alt="Company Logos"
          sx={{
            height: 55
          }}
        />

      </Toolbar>

    </AppBar>
  );
};

export default Navbar;