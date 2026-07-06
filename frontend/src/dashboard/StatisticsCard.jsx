import React from "react";

import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import { motion } from "framer-motion";

const StatisticsCard = ({
  title,
  value,
  icon,
  color
}) => {

  return (

    <Card

      component={motion.div}

      whileHover={{
        y: -8,
        scale: 1.03
      }}

      transition={{
        duration: .25
      }}

      sx={{

        borderRadius: 5,

        boxShadow:
          "0 12px 30px rgba(0,0,0,.10)",

        height: 170,

        overflow: "hidden",

        position: "relative"

      }}

    >

      <Box

        sx={{

          position: "absolute",

          top: 0,

          left: 0,

          width: 8,

          height: "100%",

          background: color

        }}

      />

      <CardContent

        sx={{

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          height: "100%",

          pl: 4

        }}

      >

        <Box>

          <Typography

            sx={{

              color: "#64748B",

              fontWeight: 600,

              fontSize: 15

            }}

          >

            {title}

          </Typography>

          <Typography

            sx={{

              mt: 2,

              fontSize: 36,

              fontWeight: 800,

              color: "#0F172A"

            }}

          >

            {value}

          </Typography>

        </Box>

        <Box

          sx={{

            width: 82,

            height: 82,

            borderRadius: "50%",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            background: color + "20",

            color: color

          }}

        >

          {React.cloneElement(icon, {

            sx: {

              fontSize: 45

            }

          })}

        </Box>

      </CardContent>

    </Card>

  );

};

export default StatisticsCard;