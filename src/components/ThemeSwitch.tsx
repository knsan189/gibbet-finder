import { FormControlLabel, Switch, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { toggleDarkMode } from "../redux/reducers/config";

const ThemeSwitch = () => {
  const dispatch = useDispatch();
  const handleChange = (event: any, checked: boolean) => {
    dispatch(toggleDarkMode(checked));
  };

  return (
    <FormControlLabel
      control={<Switch />}
      label={
        <Typography variant="body2" color="text.primary">
          다크모드
        </Typography>
      }
      onChange={handleChange}
    />
  );
};

export default ThemeSwitch;
