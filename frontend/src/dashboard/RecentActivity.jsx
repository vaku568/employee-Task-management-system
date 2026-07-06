import React from "react";

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider
} from "@mui/material";

const RecentActivity = ({
  activities = []
}) => {

  return (

    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        height: "100%"
      }}
    >

      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
      >
        Recent Activity
      </Typography>

      <List>

        {

          activities.map((activity, index) => (

            <React.Fragment key={index}>

              <ListItem>

                <ListItemAvatar>

                  <Avatar
                    sx={{
                      bgcolor:
                        activity.color || "#1976D2"
                    }}
                  >

                    {activity.icon}

                  </Avatar>

                </ListItemAvatar>

                <ListItemText

                  primary={activity.title}

                  secondary={activity.time}

                />

              </ListItem>

              {

                index !== activities.length - 1 && (

                  <Divider />

                )

              }

            </React.Fragment>

          ))

        }

      </List>

    </Paper>

  );

};

export default RecentActivity;