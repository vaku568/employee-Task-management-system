import React from "react";

import {
  Paper,
  Typography
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const TeamPerformanceChart = ({
  data = []
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

        Team Performance

      </Typography>

      <ResponsiveContainer

        width="100%"

        height={320}

      >

        <BarChart data={data}>

          <CartesianGrid

            strokeDasharray="3 3"

          />

          <XAxis dataKey="team" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar

            dataKey="tasks"

            fill="#1976D2"

            radius={[6, 6, 0, 0]}

          />

        </BarChart>

      </ResponsiveContainer>

    </Paper>

  );

};

export default TeamPerformanceChart;