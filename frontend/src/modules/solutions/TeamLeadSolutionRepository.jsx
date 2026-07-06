import React, {
  useEffect,
  useState
} from "react";

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

import axiosInstance
from "../../services/axiosInstance";

const TeamLeadSolutionRepository = () => {

  const [tab, setTab] =
    useState(0);

  const [
    approvedSolutions,
    setApprovedSolutions
  ] = useState([]);

  const [
    reworkSolutions,
    setReworkSolutions
  ] = useState([]);

  const [
    historySolutions,
    setHistorySolutions
  ] = useState([]);

  const fetchApproved =
    async () => {

      try {

        const response =
          await axiosInstance.get(
            "/solutions/approved-repository"
          );

        setApprovedSolutions(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

  const fetchRework =
    async () => {

      try {

        const response =
          await axiosInstance.get(
            "/solutions/rework-repository"
          );

        setReworkSolutions(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

  const fetchHistory =
    async () => {

      try {

        const response =
          await axiosInstance.get(
            "/solutions/history-repository"
          );

        setHistorySolutions(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

  useEffect(() => {

    fetchApproved();
    fetchRework();
    fetchHistory();

  }, []);

  const renderTable =
    (data) => (

      <TableContainer
        component={Paper}
        sx={{ mt: 2 }}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Employee
              </TableCell>

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
                Files
              </TableCell>

              <TableCell>
                Date
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {data.length > 0 ? (

              data.map(
                (solution) => (

                  <TableRow
                    key={solution._id}
                  >

                    <TableCell>
                      {
                        solution
                          .employeeId
                          ?.name
                      }
                    </TableCell>

                    <TableCell>
                      {
                        solution
                          .taskId
                          ?.studentName
                      }
                    </TableCell>

                    <TableCell>
                      {
                        solution
                          .taskId
                          ?.moduleCode
                      }
                    </TableCell>

                    <TableCell>
                      {
                        solution
                          .solutionType
                      }
                    </TableCell>

                    <TableCell>
                      {
                        solution
                          .reviewStatus
                      }
                    </TableCell>

                    <TableCell>

                      {solution.files &&
                      solution.files.length > 0 ? (

                        solution.files.map(
                          (
                            file,
                            index
                          ) => (

                            <div
                              key={index}
                            >

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

                    <TableCell>

                      {
                        solution.createdAt
                          ? new Date(
                              solution.createdAt
                            ).toLocaleString()
                          : "-"
                      }

                    </TableCell>

                  </TableRow>

                )
              )

            ) : (

              <TableRow>

                <TableCell
                  colSpan={7}
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

        Team Lead Solution Repository

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
            label="Approved Repository"
          />

          <Tab
            label="Rework Repository"
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

export default TeamLeadSolutionRepository;