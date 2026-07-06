import React from "react";

import { Box } from "@mui/material";

const LandingBackground = ({ children }) => {

  return (

    <Box
      sx={{
        minHeight: "100vh",

        backgroundImage:
          "url('/office-bg.png')",

        backgroundSize: "cover",

        backgroundPosition: "center",

        backgroundRepeat: "no-repeat",

        position: "relative",

        overflow: "hidden"
      }}
    >

      {/* Dark Overlay */}

      <Box
        sx={{
          position: "absolute",

          inset: 0,

          background:
            "linear-gradient(135deg, rgba(7,20,38,.80), rgba(15,76,129,.70))",

          zIndex: 1
        }}
      />

      {/* Blue Glow */}

      <Box
        sx={{
          position: "absolute",

          width: 600,

          height: 600,

          borderRadius: "50%",

          background:
            "rgba(79,195,247,.20)",

          filter:
            "blur(120px)",

          top: -150,

          left: -150,

          zIndex: 1
        }}
      />

      {/* Green Glow */}

      <Box
        sx={{
          position: "absolute",

          width: 500,

          height: 500,

          borderRadius: "50%",

          background:
            "rgba(46,125,50,.18)",

          filter:
            "blur(120px)",

          bottom: -100,

          right: -100,

          zIndex: 1
        }}
      />

      {/* Page */}

      <Box
        sx={{
          position: "relative",

          zIndex: 2,

          minHeight: "100vh"
        }}
      >

        {children}

      </Box>

    </Box>

  );

};

export default LandingBackground;