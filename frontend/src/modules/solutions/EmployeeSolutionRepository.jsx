import React, { useEffect, useState } from "react";

import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer
} from "@mui/material";

import axiosInstance from "../../services/axiosInstance";

const EmployeeSolutionRepository = () => {

  const [tab, setTab] = useState(0);

  const [approvedSolutions,
    setApprovedSolutions] = useState([]);

  const [reworkSolutions,
    setReworkSolutions] = useState([]);

  const [historySolutions,
    setHistorySolutions] = useState([]);

  const fetchApprovedSolutions =
    async () => {

      try {

        const response =
          await axiosInstance.get(
            "/solutions/my-approved"
          );

        setApprovedSolutions(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

  const fetchReworkSolutions =
    async () => {

      try {

        const response =
          await axiosInstance.get(
            "/solutions/my-rework"
          );

        setReworkSolutions(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

  const fetchHistorySolutions =
    async () => {

      try {

        const response =
          await axiosInstance.get(
            "/solutions/my-history"
          );

        setHistorySolutions(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

  useEffect(() => {

    fetchApprovedSolutions();

    fetchReworkSolutions();

    fetchHistorySolutions();

  }, []);

  const renderTable = (data) => (

    <TableContainer
      component={Paper}
      sx={{ mt: 2 }}
    >

      <Table>

        <TableHead>

          <TableRow>

            <TableCell>
              Student
            </TableCell>

            <TableCell>
              Module
            </TableCell>

            <TableCell>
              Solution Type
            </TableCell>

            <TableCell>
              Review Status
            </TableCell>

            <TableCell>
              Submitted At
            </TableCell>

            <TableCell>Files</TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {data.length > 0 ? (

            data.map((solution) => (

              <TableRow
                key={solution._id}
              >

                <TableCell>
                  {
                    solution.taskId
                      ?.studentName
                  }
                </TableCell>

                <TableCell>
                  {
                    solution.taskId
                      ?.moduleCode
                  }
                </TableCell>

                <TableCell>
                  {
                    solution.solutionType
                  }
                </TableCell>

                <TableCell>
                  {
                    solution.reviewStatus
                  }
                </TableCell>

                <TableCell>
                  {
                    solution.createdAt
                      ? new Date(
                          solution.createdAt
                        ).toLocaleString()
                      : "-"
                  }
                </TableCell>
                <TableCell>

  {solution.files &&
   solution.files.length > 0 ? (

    solution.files.map(
      (file, index) => (

        <div key={index}>

          <a
            href={`http://localhost:5000/${file}`}
            target="_blank"
            rel="noreferrer"
          >
            View File {index + 1}
          </a>

        </div>

      )
    )

  ) : (

    "No File"

  )}

</TableCell>

              </TableRow>

            ))

          ) : (

            <TableRow>

              <TableCell
                colSpan={5}
                align="center"
              >

                No Records Found

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>

    </TableContainer>

  );

  return (

    <Box sx={{ p: 4 }}>

      <Typography
        variant="h4"
        gutterBottom
      >

        Employee Solution Repository

      </Typography>

      <Paper sx={{ p: 2 }}>

        <Tabs
          value={tab}
          onChange={(
            event,
            newValue
          ) =>
            setTab(newValue)
          }
        >

          <Tab
            label="Approved Solutions"
          />

          <Tab
            label="Rework Solutions"
          />

          <Tab
            label="Submission History"
          />

        </Tabs>

        {tab === 0 &&
          renderTable(
            approvedSolutions
          )}

        {tab === 1 &&
          renderTable(
            reworkSolutions
          )}

        {tab === 2 &&
          renderTable(
            historySolutions
          )}

      </Paper>

    </Box>

  );

};

export default EmployeeSolutionRepository;