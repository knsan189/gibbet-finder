import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { findUserRequest } from "../../redux/reducers/user";
import SearchInput from "./SearchInput";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const { status } = useSelector((state: RootState) => state.user);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    dispatch(findUserRequest(value));
  };

  const onClear = () => {
    setValue("");
  };

  return (
    <form onSubmit={onSubmit}>
      <Box display="flex" m={3} justifyContent="center" position="relative">
        <SearchInput
          value={value}
          onChange={onChange}
          onClear={onClear}
          placeholder="캐릭터명 검색"
        />
        <LoadingButton
          variant="contained"
          disableElevation
          type="submit"
          loading={status === "loading"}
          sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          검색
        </LoadingButton>
      </Box>
    </form>
  );
};

export default SearchBar;
