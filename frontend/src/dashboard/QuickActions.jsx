import React from "react";

import {
  Paper,
  Typography,
  Grid,
  Button
} from "@mui/material";

const QuickActions = ({
  actions = []
}) => {

  return (

    <Paper

      elevation={3}

      sx={{

        p: 3,

        borderRadius: 4

      }}

    >

      <Typography

        variant="h6"

        fontWeight={700}

        mb={3}

      >

        Quick Actions

      </Typography>

      <Grid

        container

        spacing={2}

      >

        {

          actions.map((action) => (

            <Grid

              item

              xs={12}

              sm={6}

              md={4}

              key={action.label}

            >

              <Button

                fullWidth

                variant="contained"

                startIcon={action.icon}

                onClick={action.onClick}

                sx={{

                  py: 1.5,

                  borderRadius: 3,

                  textTransform: "none",

                  fontWeight: 700,

                  background:
                    action.color ||

                    "#1976D2",

                  "&:hover": {

                    opacity: .9,

                    background:
                      action.color ||

                      "#1976D2"

                  }

                }}

              >

                {action.label}

              </Button>

            </Grid>

          ))

        }

      </Grid>

    </Paper>

  );

};

export default QuickActions;