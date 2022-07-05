import { Box, LinearProgress, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Result from "../components/Result/Result";
import Search from "../components/Search/Search";
import { RootState } from "../redux/reducers";
import { getGibbetList } from "../redux/reducers/gibbet";

const Home = () => {
  const dispatch = useDispatch();
  const { gibbets } = useSelector((state: RootState) => state.gibbets);

  useEffect(() => {
    if (!gibbets.length) {
      dispatch(getGibbetList());
    }
  }, [dispatch, gibbets]);

  if (!gibbets.length) {
    return (
      <Box sx={{ height: "100vh" }} display="flex" justifyContent="center" alignItems="center">
        <Box width={500}>
          <Typography variant="subtitle2">챈내 효수목록 불러들이는 중..</Typography>
          <LinearProgress sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex">
      <Search />
      <Result />
    </Box>
  );
};

export default Home;
