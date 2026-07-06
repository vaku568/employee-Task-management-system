import React from "react";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box
} from "@mui/material";

import { motion } from "framer-motion";

import AnimatedText from "../components/common/AnimatedText";

const RoleCard = ({
  icon,
  title,
  color,
  texts,
  onClick
}) => {

  return (

    <Card
      component={motion.div}
      whileHover={{
        scale: 1.03,
        y: -8
      }}
      whileTap={{
        scale: 0.98
      }}
      onClick={onClick}
      sx={{

        width: 350,

        minHeight: 340,

        borderRadius: 6,

        cursor: "pointer",

        background: "rgba(255,255,255,0.10)",

        backdropFilter: "blur(16px)",

        WebkitBackdropFilter: "blur(16px)",

        border: "1px solid rgba(255,255,255,.20)",

        color: "#FFFFFF",

        transition: "0.35s",

        boxShadow:
          "0 20px 45px rgba(0,0,0,.30)",

        overflow: "visible",

        "&:hover": {

          border:
            "1px solid rgba(79,195,247,.65)",

          boxShadow:
            "0 25px 60px rgba(79,195,247,.35)"

        }

      }}
    >

      <CardContent

        sx={{

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          textAlign: "center",

          py: 4,

          px: 3,

          gap: 2

        }}

      >

        <Box

          sx={{

            width: 82,

            height: 82,

            borderRadius: "50%",

            background:
              "rgba(255,255,255,.12)",

            display: "flex",

            alignItems: "center",

            justifyContent: "center"

          }}

        >

          {

            React.cloneElement(icon, {

              sx: {

                fontSize: 46,

                color: color

              }

            })

          }

        </Box>

        <Typography

          sx={{

            fontSize: "2.4rem",

            fontWeight: 800,

            color: "#FFFFFF",

            lineHeight: 1.15

          }}

        >

          {title}

        </Typography>

        <Typography

          sx={{

            color: color,

            fontWeight: 700,

            fontSize: "1rem",

            height: 28,

            display: "flex",

            alignItems: "center",

            justifyContent: "center"

          }}

        >

          <AnimatedText texts={texts} />

        </Typography>

        <Button

          fullWidth

          variant="contained"

          sx={{

            width: "70%",

            mt: 1,

            borderRadius: 50,

            py: 1.2,

            background: color,

            fontWeight: 700,

            fontSize: "0.95rem",

            textTransform: "none",

            "&:hover": {

              background: color

            }

          }}

        >

          Continue →

        </Button>

      </CardContent>

    </Card>

  );

};

export default RoleCard;