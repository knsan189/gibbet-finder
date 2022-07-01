import { Box } from "@mui/material";
import React, { useState } from "react";
import Result from "../components/Result/Result";
import Search from "../components/Search/Search";

const Home = () => {
  const [user, setUser] = useState({});
  return (
    <Box display="flex">
      <Search />
      <Result />
    </Box>
  );
};

export default Home;
