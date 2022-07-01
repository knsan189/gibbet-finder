import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans KR, Roboto, sans-serif",
  },
  spacing: 10,
  palette: {
    primary: {
      main: "#3d414d",
    },
  },
});

export default theme;
