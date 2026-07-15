import { Box, Container } from "@mui/material";

import { useNavigate } from "react-router-dom";

import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import LandingBackground from "../../landing/LandingBackground";
import HeroSection from "../../landing/HeroSection";
import RoleCard from "../../landing/RoleCard";

const RoleSelectionPage = () => {

  const navigate = useNavigate();

  return (
    <>
      <LandingBackground>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "90vh"
          }}
        >

          <Container maxWidth="lg">

            {/* Hero Section */}

            <HeroSection />

            {/* Role Cards */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                flexWrap: "wrap",
                mt: 6
              }}
            >

              <RoleCard
                icon={
                  <AdminPanelSettingsIcon />
                }
                title="Team Lead"
                color="#4FC3F7"
                texts={[
  "Task Allocation",
  "Employee Management",
  "Review Management",
  "Work Tracking"
]}
                onClick={() =>
                  navigate("/teamlead-login")
                }
              />

              <RoleCard
                icon={
                  <GroupsIcon />
                }
                title="Employee"
                color="#2E7D32"
                texts={[
  "View Tasks",
  "Submit Work",
  "Track Progress",
  "Receive Feedback"
]}
                
                onClick={() =>
                  navigate("/employee-login")
                }
              />

            </Box>

          </Container>

        </Box>

      </LandingBackground>

    </>
  );

};

export default RoleSelectionPage;