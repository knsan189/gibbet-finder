import { Box, LinearProgress, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { History } from "./@types/redux/user.interface";
import useNotifier from "./hooks/useNotifier";
import useOpencv from "./hooks/useOpencv";
import useTheme from "./lib/theme";
import Capture from "./pages/Capture";
import Home from "./pages/Home";
import { RootState } from "./redux/reducers";
import { getGibbetList } from "./redux/reducers/gibbet";
import { setHistories } from "./redux/reducers/user";
import "./styles/App.css";

export const OpenCv = React.createContext<any>(null);

function App() {
  useNotifier();
  const dispatch = useDispatch();
  const { gibbets } = useSelector((state: RootState) => state.gibbets);
  const { theme } = useTheme();
  const { cv } = useOpencv();

  useEffect(() => {
    if (!gibbets.length) {
      dispatch(getGibbetList());
      const localData = localStorage.getItem("history");
      if (localData) {
        const histories: History[] = JSON.parse(localData);
        dispatch(setHistories(histories));
      }
    }
  }, [dispatch, gibbets]);

  return (
    <ThemeProvider theme={theme}>
      <OpenCv.Provider value={cv}>
        {cv ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/capture" element={<Capture />} />
          </Routes>
        ) : (
          <Box sx={{ height: "100vh" }} display="flex" justifyContent="center" alignItems="center">
            <Box width={500}>
              <Typography variant="subtitle2" gutterBottom>
                라이브러리 로딩중..
              </Typography>
              <LinearProgress sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        )}
      </OpenCv.Provider>
    </ThemeProvider>
  );
}

export default App;
