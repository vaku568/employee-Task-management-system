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
          "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",

        border: "1px solid rgba(255,255,255,0.18)",

        boxShadow:
          "0 10px 35px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,.15)",

        transition: "all .35s ease",

        overflow: "hidden",

        "&:hover": {
          transform: "translateY(-3px)",

          boxShadow:
            "0 18px 45px rgba(0,0,0,.25), inset 0 1px 1px rgba(255,255,255,.18)",

          border: "1px solid rgba(255,255,255,.28)",
        },

        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default GlassContainer;