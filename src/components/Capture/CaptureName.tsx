import { Box, TextField } from "@mui/material";
import React from "react";
import ResultGibbet from "../Result/ResultGibbet";

interface Props {
  user: User | null;
}

const CaptureName = ({ user }: Props) => {
  return (
    <Box display="flex">
      <Box width={240} mr={2}>
        <TextField value={user?.charName} size="small" fullWidth />
      </Box>
      {user && <ResultGibbet user={user} />}
    </Box>
  );
};

export default CaptureName;
