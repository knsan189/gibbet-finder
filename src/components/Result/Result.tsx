import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Drawer,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { GIBBIT_LIST_URL } from "../../utils/const";
import ResultCharList from "./ResultCharList";

const width = 800;
const Result = () => {
  const { user } = useSelector((state: RootState) => state.user);

  console.log(user);

  const handleClick = () => {
    window.require("electron").shell.openExternal(GIBBIT_LIST_URL);
  };

  return (
    <Drawer
      open={Boolean(user)}
      variant="persistent"
      anchor="right"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: "#eee",
          overflowY: "scroll",
          p: 2,
          "& > *": {
            mb: 2,
          },
        },
      }}
    >
      <Paper>
        <CardHeader title="효수 검색 결과" titleTypographyProps={{ variant: "h6" }} />
        <Divider />
        <Box p={2}>
          <Typography color="error">빼박 효수 O</Typography>
          <Typography variant="body2">
            오레하 환승 (계삭튀) https://arca.live/b/lostark/34715578
            https://arca.live/b/lostark/34669908
          </Typography>
        </Box>
      </Paper>
      <Paper>
        <CardHeader title="캐릭터 정보" titleTypographyProps={{ variant: "h6" }} />
        <Divider />
        <CardContent>
          <Typography variant="body2">
            @{user?.serverName} / {user?.guildName}
          </Typography>
          <Typography variant="body2">{user?.charName}</Typography>
          <Typography variant="caption">
            {user?.charClass} {user?.charLevel}
          </Typography>
        </CardContent>
      </Paper>
      <ResultCharList list={user?.allCharList} />
      <Box>
        <Button onClick={handleClick}>챈에서 효수 목록 확인하기</Button>
      </Box>
    </Drawer>
  );
};

export default Result;
