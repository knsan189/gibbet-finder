import { Box, LinearProgress, ThemeProvider, Typography } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import useNotifier from "./hooks/useNotifier";
import useOpencv from "./hooks/useOpencv";
import useTheme from "./lib/theme";
import Capture from "./pages/Capture";
import Home from "./pages/Home";
import "./styles/App.css";

export const OpenCv = React.createContext<any>(null);

function App() {
  useNotifier();
  const { theme } = useTheme();
  const { cv } = useOpencv();
  return (
    <ThemeProvider theme={theme}>
      <OpenCv.Provider value={cv}>
        <Box>
          {cv ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/capture" element={<Capture />} />
            </Routes>
          ) : (
            <Box
              sx={{ height: "100vh" }}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box width={500}>
                <Typography variant="subtitle2">opencv</Typography>
                <LinearProgress sx={{ borderRadius: 2 }} />
              </Box>
            </Box>
          )}
        </Box>
      </OpenCv.Provider>
    </ThemeProvider>
  );
}

export default App;
