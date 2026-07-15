import { Box } from "@mui/material";

const GlassContainer = ({
  children,
  sx = {},
  height = "100%",
  padding = 3,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: height,

        p: padding,

        borderRadius: "24px",

        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        background:
          "linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.22))",

        border: "1px solid rgba(255,255,255,0.38)",

        boxShadow:
          "0 10px 35px rgba(0,0,0,0.22), inset 0 1px 1px rgba(255,255,255,.25)",

        transition: "all .35s ease",

        overflow: "hidden",

        "&:hover": {
          transform: "translateY(-3px)",

          boxShadow:
            "0 18px 45px rgba(0,0,0,.3), inset 0 1px 1px rgba(255,255,255,.3)",

          border: "1px solid rgba(255,255,255,.48)",
        },

        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default GlassContainer;