import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Avatar
} from "@mui/material";

import { useState } from "react";

import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Groups
} from "@mui/icons-material";

import { motion } from "framer-motion";

import {
  Link,
  useNavigate
} from "react-router-dom";

import axiosInstance from "../../services/axiosInstance";

const EmployeeLogin = () => {

  const navigate =
    useNavigate();

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [error,
    setError] =
    useState("");

  const handleLogin =
    async () => {

      try {

        setError("");

        console.log("[DEBUG] EmployeeLogin - Calling login API with:", { email });
        const response =
          await axiosInstance.post(
            "/auth/login",
            {
              email,
              password
            }
          );
        console.log("[DEBUG] EmployeeLogin - Login response received:", response.status);
        console.log("[DEBUG] EmployeeLogin - Response data:", response.data);
        console.log("[DEBUG] EmployeeLogin - Response data.token:", response.data.token);
        console.log("[DEBUG] EmployeeLogin - Response data.user:", response.data.user);

        // Only save token and user if login is successful (APPROVED)
        console.log("[DEBUG] EmployeeLogin - Storing token in localStorage");
        localStorage.setItem(
          "token",
          response.data.token
        );
        console.log("[DEBUG] EmployeeLogin - Token stored:", localStorage.getItem("token") ? "EXISTS" : "MISSING");

        console.log("[DEBUG] EmployeeLogin - Storing user in localStorage");
        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );
        console.log("[DEBUG] EmployeeLogin - User stored:", localStorage.getItem("user") ? "EXISTS" : "MISSING");

        // Redirect to dashboard for approved employees
        navigate("/employee/dashboard");

      } catch (err) {

        const errorMessage = err.response?.data?.message || "Login Failed";
        const status = err.response?.status;

        if (status === 403) {
          // Account pending or rejected - show waiting/rejected page
          if (errorMessage.includes("waiting")) {
            navigate("/waiting-for-approval");
          } else if (errorMessage.includes("rejected")) {
            navigate("/registration-rejected");
          } else {
            setError(errorMessage);
          }
        } else {
          setError(errorMessage);
        }

      }

    };

  return (
    <>
       <Box
  sx={{
    minHeight: "90vh",

    backgroundImage: "url('/office-bg.png')",

    backgroundSize: "cover",

    backgroundPosition: "center",

    backgroundRepeat: "no-repeat",

    position: "relative",

    display: "flex",

    justifyContent: "center",

    alignItems: "center"
  }}
>
  <Box
  sx={{
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(rgba(5,25,45,.78),rgba(15,60,95,.72))"
  }}
/>
<Paper

component={motion.div}

initial={{
  opacity:0,
  y:40
}}

animate={{
  opacity:1,
  y:0
}}

transition={{
  duration:.8
}}
          elevation={8}
          sx={{

position:"relative",

zIndex:2,

p:5,

width:420,
maxWidth:"92%",

borderRadius:6,

background:"rgba(255,255,255,.10)",

backdropFilter:"blur(18px)",

WebkitBackdropFilter:"blur(18px)",

border:"1px solid rgba(255,255,255,.15)",

boxShadow:"0 20px 50px rgba(0,0,0,.35)"

}}
        >
          <Box
  display="flex"
  justifyContent="center"
  mb={2}
>

  <Avatar
    sx={{
      width: 90,
      height: 90,
      background: "#2E7D32"
    }}
  >

    <Groups
      sx={{
        fontSize: 55
      }}
    />

  </Avatar>

</Box>

       <Typography
  variant="h4"
  align="center"
  gutterBottom
  sx={{
    color: "#FFFFFF",
    fontWeight: 700
  }}
>
  Employee Portal
</Typography>

          <Typography
  align="center"
  mb={4}
  sx={{
    color: "rgba(255,255,255,.75)",
    fontSize: "1rem"
  }}
>
  Secure Employee Login
</Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

   <TextField
  fullWidth
  placeholder="Enter Email Address"
  margin="normal"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Email sx={{ color: "#4FC3F7" }} />
      </InputAdornment>
    ),
  }}
  sx={{
    mt: 2,

    "& .MuiOutlinedInput-root": {
      color: "#FFFFFF",
      background: "rgba(255,255,255,.08)",
      borderRadius: 3,

      "& fieldset": {
        borderColor: "rgba(255,255,255,.30)",
      },

      "&:hover fieldset": {
        borderColor: "#4FC3F7",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#4FC3F7",
      },
    },

    "& input::placeholder": {
      color: "#DDDDDD",
      opacity: 1,
    },
  }}
/>
<TextField
  fullWidth
  placeholder="Enter Password"
  type={showPassword ? "text" : "password"}
  margin="normal"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Lock sx={{ color: "#4FC3F7" }} />
      </InputAdornment>
    ),

    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword(!showPassword)}
          sx={{ color: "#FFFFFF" }}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
  sx={{
    mt: 2,

    "& .MuiOutlinedInput-root": {
      color: "#FFFFFF",
      background: "rgba(255,255,255,.08)",
      borderRadius: 3,

      "& fieldset": {
        borderColor: "rgba(255,255,255,.30)",
      },

      "&:hover fieldset": {
        borderColor: "#4FC3F7",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#4FC3F7",
      },
    },

    "& input::placeholder": {
      color: "#DDDDDD",
      opacity: 1,
    },
  }}
/>
       <Button
  fullWidth
  variant="contained"
  size="large"
  sx={{
    mt: 4,
    py: 1.6,
    borderRadius: 20,
    fontSize: "1rem",
    fontWeight: 700,
    textTransform: "none",

    background:
      "linear-gradient(90deg,#2E7D32,#4CAF50)",

    boxShadow:
      "0 10px 25px rgba(46,125,50,.45)",

    "&:hover": {
      background:
        "linear-gradient(90deg,#256C2B,#43A047)",
    },
  }}
  onClick={handleLogin}
>
  Login
</Button>

          <Typography
            align="center"
            mt={3}
          >
            <Link
              to="/employee-register"
              style={{
  textDecoration:"none",
  color:"#FFFFFF",
  fontWeight:600,
  opacity:.9
}}

            >
              Create New Account
            </Link>
          </Typography>

          <Typography
            align="center"
            mt={4}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#FFFFFF",
                fontWeight: 600,
                 opacity:.9,
                 display:"inline-block"
              }}
            >
              ← Back To Portal Selection
            </Link>
          </Typography>

        </Paper>

      </Box>
    </>
  );
};

export default EmployeeLogin;