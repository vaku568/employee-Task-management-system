import React from "react";

import {
  Paper,
  Typography
} from "@mui/material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = [

  "#4CAF50",

  "#2196F3",

  "#FF9800",

  "#F44336"

];

const TaskProgressChart = ({
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

        Task Status Distribution

      </Typography>

      <ResponsiveContainer

        width="100%"

        height={320}

      >

        <PieChart>

          <Pie

            data={data}

            dataKey="value"

            nameKey="name"

            outerRadius={110}

            label

          >

            {

              data.map((entry, index) => (

                <Cell

                  key={index}

                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }

                />

              ))

            }

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </Paper>

  );

};

export default TaskProgressChart;