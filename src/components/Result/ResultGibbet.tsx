import { CardHeader, CircularProgress, Paper, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Gibbet } from "../../@types/redux/gitbbet.interface";
import { RootState } from "../../redux/reducers";
// import { GIBBIT_LIST_URL } from "../../utils/const";

interface Props {
  user?: User;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  color: theme.palette.success.contrastText,
  display: "flex",
  alignItems: "center",
  padding: `0px ${theme.spacing(1)}`,
  flex: 1,
  minHeight: 40,
}));

const ResultGibbet = ({ user }: Props) => {
  const { gibbets } = useSelector((state: RootState) => state.gibbets);
  const [result, setResult] = useState<Gibbet>();
  const [loading, setLoading] = useState(false);

  // const handleClick = () => {
  //   window.require("electron").shell.openExternal(GIBBIT_LIST_URL);
  // };

  const findGibbet = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await new Promise<Gibbet | undefined>((resolve) => {
      user.allCharList.forEach(({ serverName, charList }) => {
        charList.forEach((char: Char) => {
          for (let i = 0; i < gibbets.length; i++) {
            if (char.charName && gibbets[i].charList.includes(char.charName)) {
              resolve(gibbets[i]);
            }
          }
        });
      });
      resolve(undefined);
    });
    setResult(data);
    setLoading(false);
  }, [user, gibbets]);

  useEffect(() => {
    findGibbet();
  }, [findGibbet]);

  if (loading) {
    return (
      <Paper sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CardHeader title="효수 판별 중.." titleTypographyProps={{ variant: "subtitle2" }} />
        <Box>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <StyledPaper
      sx={{
        background: (theme) => (result ? theme.palette.error.light : theme.palette.success.light),
      }}
    >
      <Typography variant="body2">{`${
        result ? "😈 효수 걸린 닉네임입니다. 😈" : "😊 안전한 챈럼입니다."
      }`}</Typography>
      {/* <CardHeader
        title={`${result ? "😈 효수 걸린 닉네임입니다. 😈" : "😊 안전한 챈럼입니다."}`}
        titleTypographyProps={{ variant: "subtitle2" }}
      /> */}
      {/* {result && (
        <Box px={2} pb={1}>
          <Typography variant="body2">{result?.reason}</Typography>
        </Box>
      )} */}
    </StyledPaper>
  );
};

export default ResultGibbet;
