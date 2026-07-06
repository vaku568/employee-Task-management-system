import React from "react";

import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import { motion } from "framer-motion";

const DashboardCard = ({
  title,
  subtitle,
  icon,
  color = "#1976D2",
  children
}) => {

  return (

    <Card

      component={motion.div}

      whileHover={{
        y: -6,
        scale: 1.02
      }}

      transition={{
        duration: 0.25
      }}

      sx={{

        borderRadius: 4,

        overflow: "hidden",

        height: "100%",

        boxShadow:
          "0 12px 30px rgba(0,0,0,.08)"

      }}

    >

      <Box

        sx={{

          height: 6,

          background: color

        }}

      />

      <CardContent>

        <Box

          display="flex"

          justifyContent="space-between"

          alignItems="center"

          mb={2}

        >

          <Typography

            variant="h6"

            fontWeight={700}

          >

            {title}

          </Typography>

          {

            icon &&

            React.cloneElement(icon, {

              sx: {

                color: color,

                fontSize: 34

              }

            })

          }

        </Box>

        {

          subtitle && (

            <Typography

              color="text.secondary"

              mb={2}

            >

              {subtitle}

            </Typography>

          )

        }

        {children}

      </CardContent>

    </Card>

  );

};

export default DashboardCard;