import {
  Box,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { User } from "../../@types/type";

interface Props {
  user?: User;
}

const ResultCharInfo = ({ user }: Props) => {
  if (!user) {
    return null;
  }

  const { itemLevel, charClass, charLevel, charName, serverName, guildName, wisdom } = user;
  return (
    <Paper>
      <CardHeader title="캐릭터 정보" titleTypographyProps={{ variant: "h6" }} />
      <Box px={2} pb={2} display="flex" flexWrap="wrap">
        <Box display="flex" justifyContent="start" alignItems="center" width="50%" mb={1}>
          <Chip label="서버명" />
          <Typography variant="body2" ml={2}>
            {serverName}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="start" alignItems="center" width="50%" mb={1}>
          <Chip label="캐릭터명" />
          <Typography variant="body2" ml={2}>
            {charName}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="start" alignItems="center" width="50%" mb={1}>
          <Chip label="직업명" />
          <Typography variant="body2" ml={2}>
            {charClass}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="start" alignItems="center" width="50%" mb={1}>
          <Chip label="레벨" />
          <Typography variant="body2" ml={2}>
            {itemLevel} ({charLevel})
          </Typography>
        </Box>
        <Box display="flex" justifyContent="start" alignItems="center" width="50%" mb={1}>
          <Chip label="길드명" />
          <Typography variant="body2" ml={2}>
            {guildName}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="start" alignItems="center" width="50%" mb={1}>
          <Chip label="영지명" />
          <Typography variant="body2" ml={2}>
            {wisdom.name} ({wisdom.level})
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ResultCharInfo;
