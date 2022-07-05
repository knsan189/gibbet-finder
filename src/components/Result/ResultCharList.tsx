import { Avatar, Box, CardHeader, Chip, Paper, Typography } from "@mui/material";
import React from "react";
import { User } from "../../@types/type";

interface Props {
  list?: User["allCharList"];
}

const ResultCharList = ({ list }: Props) => {
  if (!list) return null;
  return (
    <Paper>
      <CardHeader title="원정대 목록" titleTypographyProps={{ variant: "h6" }} />
      <Box px={2} pb={2} display="flex" flexWrap="wrap">
        {list.map((server, index) => {
          return (
            <Box key={server.serverName} mb={list.length - 1 !== index ? 1 : 0}>
              <Chip label={server.serverName.replace("@", "")} />
              <Box display="flex" flexWrap="wrap" pt={1}>
                {server.charList.map((char) => (
                  <Paper key={char.charName} sx={{ mr: 1, mb: 1 }}>
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
                  </Paper>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default ResultCharList;
