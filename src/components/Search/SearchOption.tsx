import { Close } from "@mui/icons-material";
import { IconButton, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { History } from "../../@types/redux/user.interface";
import { RootState } from "../../redux/reducers";
import { setHistories } from "../../redux/reducers/user";

interface Props {
  option: History;
  optionProps: React.HTMLAttributes<HTMLLIElement>;
}

const SearchOption = ({ option, optionProps }: Props) => {
  const dispatch = useDispatch();
  const { histories } = useSelector((state: RootState) => state.user);
  const handleRemove: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    const newHistories = [...histories];
    const targetIndex = newHistories.findIndex((history) => history.keyword === option.keyword);
    newHistories.splice(targetIndex, 1);
    dispatch(setHistories(newHistories));
  };

  return (
    <ListItem {...optionProps}>
      <ListItemText
        primary={option.keyword}
        primaryTypographyProps={{ variant: "body2" }}
        secondary={new Date(option.date).toLocaleString()}
        secondaryTypographyProps={{ variant: "caption" }}
      />
      <IconButton size="small" onClick={handleRemove}>
        <Close fontSize="small" />
      </IconButton>
    </ListItem>
  );
};

export default SearchOption;
