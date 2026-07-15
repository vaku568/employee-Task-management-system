import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  MenuItem,
  Alert,
  Avatar,
  InputAdornment,
  Snackbar
} from "@mui/material";

import { useState } from "react";

import {
  Groups,
  Person,
  Email,
  Lock,
  School,
  GroupWork
} from "@mui/icons-material";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import axiosInstance from "../../services/axiosInstance";

const EmployeeRegister = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    qualification: "",
    team: ""
  });

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async () => {

    try {

      setError("");
      setMessage("");

      const response = await axiosInstance.post(
        "/employees/register",
        formData
      );

      setMessage(response.data.message);
      setOpenSnackbar(true);

      // Clear form after successful registration
      setFormData({
        name: "",
        email: "",
        password: "",
        qualification: "",
        team: ""
      });

    }

    catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration Failed"
      );
      setOpenSnackbar(true);

    }

  };

  const inputStyle = {

    mt: 2,

    "& .MuiOutlinedInput-root": {

      color: "#FFFFFF",

      background: "rgba(255,255,255,.08)",

      borderRadius: 3,

      "& fieldset": {
        borderColor: "rgba(255,255,255,.25)"
      },

      "&:hover fieldset": {
        borderColor: "#4FC3F7"
      },

      "&.Mui-focused fieldset": {
        borderColor: "#4FC3F7"
      }

    }

  };

 return (

  <>

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

      {/* Overlay */}

      <Box
        sx={{

          position: "absolute",

          inset: 0,

          background:
            "linear-gradient(rgba(5,25,45,.78),rgba(15,60,95,.72))"

        }}
      />

      {/* Glass Card */}

      <Paper

        component={motion.div}

        initial={{
          opacity: 0,
          y: 40
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: .8
        }}

        sx={{

          position: "relative",

          zIndex: 2,

          width: 450,

          maxWidth: "92%",

          p: 5,

          borderRadius: 6,

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

          sx={{

            color: "#FFFFFF",

            fontWeight: 700

          }}

        >

          Create Account

        </Typography>

        <Typography

          align="center"

          mb={3}

          sx={{

            color:
              "rgba(255,255,255,.75)"

          }}

        >

          Employee Registration Portal

        </Typography>
        {/* Full Name */}

<TextField

  fullWidth

  placeholder="Full Name"

  name="name"

  value={formData.name}

  onChange={handleChange}

  sx={inputStyle}

  InputProps={{

    startAdornment:(

      <InputAdornment position="start">

        <Person sx={{color:"#4FC3F7"}}/>

      </InputAdornment>

    )

  }}

/>


{/* Email */}

<TextField

  fullWidth

  placeholder="Email Address"

  name="email"

  value={formData.email}

  onChange={handleChange}

  sx={inputStyle}

  InputProps={{

    startAdornment:(

      <InputAdornment position="start">

        <Email sx={{color:"#4FC3F7"}}/>

      </InputAdornment>

    )

  }}

/>


{/* Password */}

<TextField

  fullWidth

  placeholder="Password"

  type="password"

  name="password"

  value={formData.password}

  onChange={handleChange}

  sx={inputStyle}

  InputProps={{

    startAdornment:(

      <InputAdornment position="start">

        <Lock sx={{color:"#4FC3F7"}}/>

      </InputAdornment>

    )

  }}

/>


{/* Qualification */}

<TextField

  fullWidth

  placeholder="Qualification"

  name="qualification"

  value={formData.qualification}

  onChange={handleChange}

  sx={inputStyle}

  InputProps={{

    startAdornment:(

      <InputAdornment position="start">

        <School sx={{color:"#4FC3F7"}}/>

      </InputAdornment>

    )

  }}

/>


{/* Team */}

<TextField

  select

  fullWidth

  name="team"

  value={formData.team}

  onChange={handleChange}

  sx={inputStyle}

  SelectProps={{

    displayEmpty:true

  }}

  InputProps={{

    startAdornment:(

      <InputAdornment position="start">

        <GroupWork sx={{color:"#4FC3F7"}}/>

      </InputAdornment>

    )

  }}

>

<MenuItem value="">

  Select Team

</MenuItem>

<MenuItem value="ML">

  ML

</MenuItem>

<MenuItem value="DB">

  DB

</MenuItem>

<MenuItem value="CYBER">

  CYBER

</MenuItem>

<MenuItem value="GEN">

  GEN

</MenuItem>

<MenuItem value="WRITING">

  WRITING

</MenuItem>

</TextField>
<Button

  fullWidth

  variant="contained"

  onClick={handleSubmit}

  sx={{

    mt:4,

    py:1.6,

    borderRadius:20,

    fontWeight:700,

    fontSize:"1rem",

    textTransform:"none",

    background:
      "linear-gradient(90deg,#2E7D32,#4CAF50)",

    boxShadow:
      "0 10px 25px rgba(46,125,50,.45)",

    "&:hover":{

      background:
        "linear-gradient(90deg,#256C2B,#43A047)"

    }

  }}

>

  Create Account

</Button>


<Typography

  align="center"

  mt={3}

>

  <Link

    to="/employee-login"

    style={{

      textDecoration:"none",

      color:"#FFFFFF",

      fontWeight:600,

      opacity:.9

    }}

  >

    Already have an account? Login

  </Link>

</Typography>


<Typography

  align="center"

  mt={2}

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

<Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() => setOpenSnackbar(false)}
    severity={error ? "error" : "success"}
    sx={{ width: "100%" }}
  >
    {error || message}
  </Alert>
</Snackbar>

</>

);

};

export default EmployeeRegister;