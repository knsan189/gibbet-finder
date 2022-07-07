import { Button, CardHeader, CircularProgress, Paper, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Gibbet } from "../../@types/redux/gitbbet.interface";
import { User } from "../../@types/type";
import { RootState } from "../../redux/reducers";
import { GIBBIT_LIST_URL } from "../../utils/const";

interface Props {
  user?: User;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: "100%",
  position: "relative",

  color: theme.palette.success.contrastText,
}));

const ResultGibbet = ({ user }: Props) => {
  const { gibbets } = useSelector((state: RootState) => state.gibbets);
  const [result, setResult] = useState<Gibbet>();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    window.require("electron").shell.openExternal(GIBBIT_LIST_URL);
  };

  const findGibbet = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const data = await new Promise<Gibbet | undefined>((resolve) => {
      user.allCharList.forEach(({ serverName, charList }) => {
        charList.forEach((char) => {
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
      <Paper
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}
      >
        <CardHeader title="효수 판별 중.." titleTypographyProps={{ variant: "h6" }} />
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
      <CardHeader
        title={`${result ? "😈 효수 걸린 닉네임입니다. 😈" : "😊 안전한 챈럼입니다."}`}
        titleTypographyProps={{ variant: "h6" }}
      />
      {result && (
        <Box px={2} pb={2}>
          <Typography variant="body2">{result?.reason}</Typography>
        </Box>
      )}
      {/* <Box position="absolute" sx={{ bottom: 10, left: 10 }}>
        <Button variant="outlined" onClick={handleClick} size="small">
          챈에서 효수 목록 확인
        </Button>
      </Box> */}
    </StyledPaper>
  );
};

export default ResultGibbet;
