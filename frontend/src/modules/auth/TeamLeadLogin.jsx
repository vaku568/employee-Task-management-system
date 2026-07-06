import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  Avatar,
  InputAdornment,
  IconButton
} from "@mui/material";

import { useState } from "react";

import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AdminPanelSettings
} from "@mui/icons-material";

import { motion } from "framer-motion";

import {
  Link,
  useNavigate
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import axiosInstance from "../../services/axiosInstance";

const TeamLeadLogin = () => {

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

        const response =
          await axiosInstance.post(
            "/auth/login",
            {
              email,
              password
            }
          );

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

        navigate(
          "/teamlead/dashboard"
        );

      }

      catch (err) {

        setError(
          err.response?.data?.message ||
          "Login Failed"
        );

      }

    };

  const inputStyle = {

    mt: 2,

    "& .MuiOutlinedInput-root": {

      color: "#FFFFFF",

      background:
        "rgba(255,255,255,.08)",

      borderRadius: 3,

      "& fieldset": {
        borderColor:
          "rgba(255,255,255,.25)"
      },

      "&:hover fieldset": {
        borderColor:
          "#42A5F5"
      },

      "&.Mui-focused fieldset": {
        borderColor:
          "#42A5F5"
      }

    }

  };

  return (

  <>
    <Navbar />

    <Box
      sx={{

        minHeight: "90vh",

        backgroundImage:
          "url('/office-bg.png')",

        backgroundSize: "cover",

        backgroundPosition: "center",

        backgroundRepeat: "no-repeat",

        position: "relative",

        display: "flex",

        justifyContent: "center",

        alignItems: "center"

      }}
    >

      {/* Dark Overlay */}

      <Box
        sx={{

          position: "absolute",

          inset: 0,

          background:
            "linear-gradient(rgba(5,25,45,.78),rgba(15,60,95,.72))"

        }}
      />

      {/* Login Card */}

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

        sx={{

          position:"relative",

          zIndex:2,

          width:420,

          maxWidth:"92%",

          p:5,

          borderRadius:6,

          background:
            "rgba(255,255,255,.10)",

          backdropFilter:
            "blur(18px)",

          WebkitBackdropFilter:
            "blur(18px)",

          border:
            "1px solid rgba(255,255,255,.15)",

          boxShadow:
            "0 20px 50px rgba(0,0,0,.35)"

        }}

      >

        {/* Avatar */}

        <Box

          display="flex"

          justifyContent="center"

          mb={2}

        >

          <Avatar

            sx={{

              width:90,

              height:90,

              background:"#1565C0"

            }}

          >

            <AdminPanelSettings

              sx={{

                fontSize:55

              }}

            />

          </Avatar>

        </Box>

        <Typography

          variant="h4"

          align="center"

          sx={{

            color:"#FFFFFF",

            fontWeight:700

          }}

        >

          Team Lead Portal

        </Typography>

        <Typography

          align="center"

          mb={4}

          sx={{

            color:
              "rgba(255,255,255,.75)"

          }}

        >

          Secure Team Lead Login

        </Typography>
        {/* Error */}

{error && (

  <Alert
    severity="error"
    sx={{ mb:2 }}
  >

    {error}

  </Alert>

)}

{/* Email */}

<TextField

  fullWidth

  placeholder="Enter Email Address"

  value={email}

  onChange={(e)=>
    setEmail(e.target.value)
  }

  sx={inputStyle}

  InputProps={{

    startAdornment:(

      <InputAdornment position="start">

        <Email
          sx={{
            color:"#42A5F5"
          }}
        />

      </InputAdornment>

    )

  }}

/>

{/* Password */}

<TextField

  fullWidth

  placeholder="Enter Password"

  type={
    showPassword
      ? "text"
      : "password"
  }

  value={password}

  onChange={(e)=>
    setPassword(e.target.value)
  }

  sx={inputStyle}

  InputProps={{

    startAdornment:(

      <InputAdornment position="start">

        <Lock
          sx={{
            color:"#42A5F5"
          }}
        />

      </InputAdornment>

    ),

    endAdornment:(

      <InputAdornment position="end">

        <IconButton

          sx={{
            color:"#FFFFFF"
          }}

          onClick={()=>
            setShowPassword(
              !showPassword
            )
          }

        >

          {
            showPassword
            ?

            <VisibilityOff/>

            :

            <Visibility/>

          }

        </IconButton>

      </InputAdornment>

    )

  }}

/>

{/* Login Button */}

<Button

  fullWidth

  variant="contained"

  size="large"

  sx={{

    mt:4,

    py:1.6,

    borderRadius:20,

    fontWeight:700,

    fontSize:"1rem",

    textTransform:"none",

    background:
      "linear-gradient(90deg,#1565C0,#42A5F5)",

    boxShadow:
      "0 10px 25px rgba(21,101,192,.45)",

    "&:hover":{

      background:
        "linear-gradient(90deg,#0D47A1,#1E88E5)"

    }

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

    to="/"

    style={{

      textDecoration:"none",

      color:"#FFFFFF",

      fontWeight:600,

      opacity:.9

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

export default TeamLeadLogin;