import React from "react";
import { Avatar, Box, Button, Divider, styled, ThemeProvider, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { GIBBIT_LIST_URL } from "../../utils/const";

const Container = styled(Box, { shouldForwardProp: (prop) => prop !== "user" })<{
  user: boolean;
}>(({ user, theme }) => ({
  position: "relative",
  height: "calc(100vh - 1px)",
  boxSizing: "content-box",
  flexGrow: 1,
  borderTop: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: `-${800}px`,
  ...(user && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  borderRadius: theme.spacing(2),
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
}));

const Search = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const handleClick = () => {
    window.require("electron").shell.openExternal(GIBBIT_LIST_URL);
  };

  return (
    <Container user={Boolean(user)}>
      <Box p={4} display="flex" flexDirection="column" alignItems="center">
        <Avatar src="/images/mococo.jpg" sx={{ width: 120, height: 120, mb: 2 }} />
        <Typography variant="h6">로스트아크 채널 효수검색기</Typography>
        <Typography variant="body2" gutterBottom color="text.secondary">
          로아챈에 저격이 없는 그날까지
        </Typography>
      </Box>
      <SearchBar />
      <StyledButton onClick={handleClick} variant="contained">
        챈에서 효수 목록 확인
      </StyledButton>
    </Container>
  );
};

export default Search;
