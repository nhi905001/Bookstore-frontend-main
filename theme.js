// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7C4F2A",
    },
    secondary: {
      main: "#E9D8A6",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          color: "#E9D8A6",
          width: "400px",

          "& .MuiInputBase-input": {
            color: "#E9D8A6",
          },
          "& .MuiFormLabel-root": {
            color: "#E9D8A6",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#E9D8A6",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#E9D8A6",
            },
            "&:hover fieldset": {
              borderColor: "#E9D8A6 !important", // Thêm !important để thắng CSS mặc định
            },
            "&.Mui-focused fieldset": {
              borderColor: "#E9D8A6 !important",
            },
          },
        },
      },
    },
  },
});

export default theme;
