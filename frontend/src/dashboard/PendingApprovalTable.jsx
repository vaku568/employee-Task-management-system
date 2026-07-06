import React from "react";

import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Stack
} from "@mui/material";
const PendingApprovalTable = ({
  rows = [],
  onView,
  onApprove,
  onReject
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

        Pending Solution Approvals

      </Typography>

      <Table>
<TableHead>

  <TableRow
    sx={{
      background: "#1976D2"
    }}
  >

    <TableCell
      sx={{
        color: "#FFFFFF",
        fontWeight: 700
      }}
    >
      Employee
    </TableCell>

    <TableCell
      sx={{
        color: "#FFFFFF",
        fontWeight: 700
      }}
    >
      Team
    </TableCell>

    <TableCell
      sx={{
        color: "#FFFFFF",
        fontWeight: 700
      }}
    >
      Task
    </TableCell>

    <TableCell
      sx={{
        color: "#FFFFFF",
        fontWeight: 700
      }}
    >
      Submitted
    </TableCell>

    <TableCell
      sx={{
        color: "#FFFFFF",
        fontWeight: 700
      }}
    >
      Status
    </TableCell>

    <TableCell
      sx={{
        color: "#FFFFFF",
        fontWeight: 700
      }}
    >
      Actions
    </TableCell>

  </TableRow>

</TableHead>
<TableBody>

  {

    rows.map((row) => (

      <TableRow
        key={row.id}
        hover
      >

        <TableCell>
          {row.employee}
        </TableCell>

        <TableCell>
          {row.team}
        </TableCell>

        <TableCell>
          {row.task}
        </TableCell>

        <TableCell>
          {row.time}
        </TableCell>

        <TableCell>

          <Chip

            label={row.status}

            color="warning"

          />

        </TableCell>

        <TableCell>

          <Stack

            direction="row"

            spacing={1}

          >

            <Button

              size="small"

              variant="outlined"

              onClick={() =>
                onView(row)
              }

            >

              View

            </Button>

            <Button

              size="small"

              variant="contained"

              color="success"

              onClick={() =>
                onApprove(row)
              }

            >

              Approve

            </Button>

            <Button

              size="small"

              variant="contained"

              color="error"

              onClick={() =>
                onReject(row)
              }

            >

              Reject

            </Button>

          </Stack>

        </TableCell>

      </TableRow>

    ))

  }

</TableBody>
      </Table>

    </Paper>

  );

};

export default PendingApprovalTable;