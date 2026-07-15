import { Box, Typography } from "@mui/material";

const PageHeader = ({
  title,
  subtitle,
  action = null,
  showLogo = true,
}) => {
  return (
    <Box
      sx={{
        mb: 3,

        display: "flex",

        justifyContent: "space-between",

        alignItems: {
          xs: "flex-start",
          md: "center",
        },

        flexDirection: {
          xs: "column",
          md: "row",
        },

        gap: 2,
      }}
    >
      {/* Left */}

      <Box>
        <Typography
          sx={{
            color: "#ffffff",

            fontWeight: 700,

            fontSize: {
              xs: 28,
              md: 34,
            },

            letterSpacing: ".4px",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: .5,

            color: "rgba(255,255,255,.72)",

            fontSize: 15,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {/* Right */}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {action && (
          <Box>
            {action}
          </Box>
        )}
        {showLogo && (
          <Box
            component="img"
            src="/logos/company_logos.png"
            alt="Company Logo"
            sx={{
              height: 36,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;