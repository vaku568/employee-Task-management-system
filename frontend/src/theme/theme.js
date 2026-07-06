import { createTheme }
from "@mui/material/styles";

const theme =
  createTheme({

    palette: {

      mode: "light",

      primary: {
        main: "#0D3B66"
      },

      secondary: {
        main: "#1E6091"
      },

      success: {
        main: "#2D6A4F"
      },

      background: {
        default: "#F8FAFC"
      }

    },

    typography: {

      fontFamily:
        "'Poppins', 'Roboto', sans-serif",

      h3: {
        fontWeight: 700
      },

      h4: {
        fontWeight: 600
      }

    }

  });

export default theme;