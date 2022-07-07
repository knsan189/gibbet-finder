import React from "react";
import { Avatar, Box, styled, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { LOGO_URL } from "../../utils/const";
import ThemeSwitch from "../ThemeSwitch";

const Container = styled(Box, { shouldForwardProp: (prop) => prop !== "user" })<{
  user: boolean;
}>(({ user, theme }) => ({
  background: theme.palette.background.default,
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

const Search = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Container user={Boolean(user)}>
      <Box p={4} display="flex" flexDirection="column" alignItems="center">
        <Avatar src={LOGO_URL} sx={{ width: 120, height: 120, mb: 2 }} />
        <Typography variant="h6" color="text.primary" gutterBottom>
          로스트아크 채널 효수검색기
        </Typography>
        <Typography variant="body2" gutterBottom color="text.secondary">
          로아챈 무사고 365일 기원
        </Typography>
      </Box>
      <SearchBar />
      <Box sx={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)" }}>
        <ThemeSwitch />
      </Box>
    </Container>
  );
};

export default Search;
