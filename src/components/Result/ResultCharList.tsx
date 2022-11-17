import { Avatar, Box, Chip, Paper, styled, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { findUserRequest } from "../../redux/reducers/user";
import ResultCard from "./ResultCard";

interface Props {
  list?: User["allCharList"];
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  cursor: "pointer",
  "&:hover": {
    background: theme.palette.action.hover,
  },
}));

const ResultCharList = ({ list }: Props) => {
  const dispatch = useDispatch();
  if (!list) return null;
  const handleClick = (name?: string) => () => {
    if (!name) return;
    dispatch(findUserRequest(name));
  };
  return (
    <ResultCard title="원정대 목록">
      {list.map((server, index) => {
        return (
          <Box key={server.serverName} mb={list.length - 1 !== index ? 1 : 0}>
            <Chip label={server.serverName.replace("@", "")} />
            <Box display="flex" flexWrap="wrap" pt={1}>
              {server.charList.map((char) => (
                <StyledPaper key={char.charName} onClick={handleClick(char.charName)}>
                  <Box p={1} display="flex" alignItems="center">
                    <Box pr={1}>
                      <Avatar src={char.thumbnail} />
                    </Box>
                    <Box>
                      <Typography variant="body2">{char.charName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {char.charClass} {char.charLevel}
                      </Typography>
                    </Box>
                  </Box>
                </StyledPaper>
              ))}
            </Box>
          </Box>
        );
      })}
    </ResultCard>
  );
};

export default ResultCharList;
