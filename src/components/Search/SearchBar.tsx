import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box } from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { History } from "../../@types/redux/user.interface";
import { RootState } from "../../redux/reducers";
import { findUserRequest } from "../../redux/reducers/user";
import SearchInput from "./SearchInput";
import SearchOption from "./SearchOption";

const SearchBar = () => {
  const [value, setValue] = useState<History | string | null>(null);
  const dispatch = useDispatch();
  const { status, histories } = useSelector((state: RootState) => state.user);
  const inputRef = useRef<HTMLInputElement>();

  const handleChange = (event: any, option: History | string | null) => {
    if (!option) {
      return;
    }

    setValue(option);

    if (typeof option === "string") {
      dispatch(findUserRequest(option));
      return;
    }

    dispatch(findUserRequest(option.keyword));
  };

  const onSubmit = () => {
    const inputValue = inputRef?.current?.value;
    if (inputValue) dispatch(findUserRequest(inputValue));
  };

  const onClear = () => {
    setValue(null);
  };

  const handleInputChange = (event: any, inputValue: string) => {};

  const getOptionLabel = (option: string | History) => {
    if (typeof option === "string") return option;
    return option.keyword;
  };

  return (
    <Box display="flex" m={3} justifyContent="center" position="relative">
      <Autocomplete
        value={value}
        options={histories}
        freeSolo
        noOptionsText="검색 기록 없음"
        onChange={handleChange}
        onInputChange={handleInputChange}
        getOptionLabel={getOptionLabel}
        renderInput={(params) => (
          <SearchInput
            params={params}
            onClear={onClear}
            placeholder="캐릭터명 검색"
            ref={inputRef}
          />
        )}
        renderOption={(optionProps, option) => (
          <SearchOption key={optionProps.id} optionProps={optionProps} option={option} />
        )}
      />

      <LoadingButton
        variant="contained"
        disableElevation
        onClick={onSubmit}
        loading={status === "loading"}
        sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        검색
      </LoadingButton>
    </Box>
  );
};

export default SearchBar;
