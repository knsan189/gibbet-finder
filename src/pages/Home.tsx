import { Box, Button, TextField } from "@mui/material";
import React from "react";
import Logo from "../components/Logo";

const Home = () => {
  return (
    <Box>
      <Logo />

      <Box>
        <TextField fullWidth />
      </Box>
    </Box>
  );
};

export default Home;
