import { Box, CircularProgress, Drawer, Grid, styled, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import ResultCharAbility from "./ResultCharAbility";
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
    background: theme.palette.mode === "light" ? "#eee" : theme.palette.grey[900],
    overflowY: "scroll",
    padding: theme.spacing(2),
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
        <Grid container spacing={2}>
          <Grid item md={12}>
            <ResultGibbet user={user} />
          </Grid>
          <Grid item md={8}>
            <ResultCharInfo user={user} />
          </Grid>
          <Grid item md={4}>
            <ResultCharAbility user={user} />
          </Grid>
          <Grid item>
            <ResultCharEquip user={user} />
          </Grid>
          <Grid item md={12}>
            <ResultCharJewels jewels={user?.jewels} />
          </Grid>
          <Grid item>
            <ResultCharCards cards={user?.cards} />
          </Grid>
          <Grid item>
            <ResultCharList list={user?.allCharList} />
          </Grid>
        </Grid>
      )}
    </StyledDrawer>
  );
};

export default Result;
