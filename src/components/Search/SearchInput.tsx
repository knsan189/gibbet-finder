import { Search } from "@mui/icons-material";
import { AutocompleteRenderInputParams, Box, InputBase, styled } from "@mui/material";
import React, { forwardRef } from "react";

interface Props {
  params: AutocompleteRenderInputParams;
  placeholder?: string;
  onClear: () => void;
}

const InputBox = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  height: "100%",
  maxWidth: 400,
  minWidth: 300,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
}));

const SearchInput = forwardRef(({ params, placeholder }: Props, ref) => {
  return (
    <InputBox display="flex" alignItems="center" position="relative" ref={params.InputProps.ref}>
      <Search color="disabled" sx={{ px: 1 }} />
      <InputBase
        fullWidth
        placeholder={placeholder}
        inputRef={ref}
        inputProps={{ ...params.inputProps }}
      />
      {/* {value && (
        <IconButton
          sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: 0 }}
          onClick={onClear}
          color="primary"
        >
          <Clear />
        </IconButton>
      )} */}
    </InputBox>
  );
});

export default SearchInput;
