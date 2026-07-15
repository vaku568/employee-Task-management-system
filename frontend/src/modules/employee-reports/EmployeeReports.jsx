import { Box, Typography } from "@mui/material";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import PageHeader from "../../components/layout/PageHeader";
import GlassContainer from "../../components/layout/GlassContainer";

const EmployeeReports = () => {
  return (
    <EmployeeLayout>
      <PageHeader
        title="Reports"
        subtitle="View your work reports and statistics."
      />
      <GlassContainer>
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Reports content coming soon...
          </Typography>
        </Box>
      </GlassContainer>
    </EmployeeLayout>
  );
};

export default EmployeeReports;
