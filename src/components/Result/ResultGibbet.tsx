import { Button, CardHeader, CircularProgress, Paper, Typography } from "@mui/material";
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
    <Paper>
      <CardHeader
        title="효수 검색 결과"
        titleTypographyProps={{ variant: "h6", gutterBottom: true }}
        subheader={result ? "😈 효수 😈" : "😊 안전한 챈럼입니다."}
        subheaderTypographyProps={{ color: result ? "error" : "" }}
      />
      {result && (
        <>
          <Box px={2} pb={2}>
            <Typography variant="body2">{result?.reason}</Typography>
          </Box>
        </>
      )}
      <Box display="flex" justifyContent="end" pb={2} pr={2}>
        <Button variant="contained" onClick={handleClick} size="small">
          챈에서 효수 목록 확인
        </Button>
      </Box>
    </Paper>
  );
};

export default ResultGibbet;
