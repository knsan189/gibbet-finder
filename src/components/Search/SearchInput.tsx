import { Clear, Search } from "@mui/icons-material";
import { Box, IconButton, InputBase, styled } from "@mui/material";
import React from "react";

interface Props {
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const InputBox = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  maxWidth: 400,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
}));

const SearchInput = ({ value, onChange, onClear, placeholder }: Props) => {
  return (
    <InputBox display="flex" alignItems="center" position="relative">
      <Search color="disabled" sx={{ px: 1 }} />
      <InputBase value={value} onChange={onChange} fullWidth placeholder={placeholder} />
      {value && (
        <IconButton
          sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: 0 }}
          onClick={onClear}
          color="primary"
        >
          <Clear />
        </IconButton>
      )}
    </InputBox>
  );
};

export default SearchInput;
