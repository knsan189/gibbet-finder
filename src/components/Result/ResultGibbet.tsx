import { CardHeader, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { off } from "process";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Gibbet } from "../../@types/redux/gitbbet.interface";
import { User } from "../../@types/type";
import { RootState } from "../../redux/reducers";

interface Props {
  user?: User;
}

const ResultGibbet = ({ user }: Props) => {
  const { gibbets } = useSelector((state: RootState) => state.gibbets);
  const [result, setResult] = useState<Gibbet>();
  const [loading, setLoading] = useState(false);

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
        titleTypographyProps={{ variant: "h6" }}
        subheader={result ? "😈 효수 100% 😈" : "😊 안전한 챈럼입니다."}
        subheaderTypographyProps={{ color: result ? "error" : "" }}
      />
      {result && (
        <>
          <Divider />
          <Box p={2}>
            <Typography variant="body2">{result?.reason}</Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ResultGibbet;
