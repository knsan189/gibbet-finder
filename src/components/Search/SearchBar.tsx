import { Search } from "@mui/icons-material";
import { Box, Button, InputBase, styled } from "@mui/material";
import React, { ChangeEventHandler, useState } from "react";
import { useDispatch } from "react-redux";
import { findUserRequest, setUser } from "../../redux/reducers/user";
import UserService from "../../service/UserService";
import SearchInput from "./SearchInput";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
  };

  const onSubmit = () => {
    dispatch(findUserRequest(value));
  };

  return (
    <Box display="flex" p={4} justifyContent="center">
      <SearchInput value={value} onChange={onChange} />
      <Button variant="contained" disableElevation onClick={onSubmit}>
        검색
      </Button>
    </Box>
  );
};

export default SearchBar;
