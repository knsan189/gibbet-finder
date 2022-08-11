import { ThemeProvider } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import useNotifier from "./hooks/useNotifier";
import useTheme from "./lib/theme";
import Capture from "./pages/Capture";
import Home from "./pages/Home";
import "./styles/App.css";

function App() {
  useNotifier();
  const { theme } = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capture" element={<Capture />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
