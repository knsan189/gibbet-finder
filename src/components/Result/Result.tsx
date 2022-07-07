import { Box, CircularProgress, Drawer, styled, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import ResultCharCards from "./ResultCharCards";
import ResultCharEquip from "./ResultCharEquip";
import ResultCharInfo from "./ResultCharInfo";
import ResultCharJewels from "./ResultCharJewels";
import ResultCharList from "./ResultCharList";
import ResultGibbet from "./ResultGibbet";

const width = 800;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width,
    boxSizing: "border-box",
    borderTop: `1px solid ${theme.palette.divider}`,
    background: theme.palette.mode === "light" ? "#eee" : theme.palette.grey[800],
    overflowY: "scroll",
    padding: theme.spacing(2),
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
}));

const Result = () => {
  const { user, status } = useSelector((state: RootState) => state.user);

  return (
    <StyledDrawer open={Boolean(user)} variant="persistent" anchor="right">
      {status === "loading" ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress />
            <Typography variant="body2" mt={2}>
              챈럼 정보 불러오는중..
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <ResultGibbet user={user} />
          <ResultCharInfo user={user} />
          <ResultCharEquip user={user} />
          <ResultCharJewels jewels={user?.jewels} />
          <ResultCharCards cards={user?.cards} />
          <ResultCharList list={user?.allCharList} />
        </>
      )}
    </StyledDrawer>
  );
};

export default Result;
