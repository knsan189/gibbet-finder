import { Search } from "@mui/icons-material";
import { Box, InputBase, styled } from "@mui/material";
import React from "react";

interface Props {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  maxWidth: 400,
}));

const SearchInput = ({ value, onChange }: Props) => {
  return (
    <InputBox display="flex" alignItems="center">
      <Box px={1} py={0.5}>
        <Search color="disabled" />
      </Box>
      <InputBase value={value} onChange={onChange} fullWidth />
    </InputBox>
  );
};

export default SearchInput;
