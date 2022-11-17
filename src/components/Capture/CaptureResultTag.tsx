import { Box, CircularProgress, styled, Typography, useTheme } from "@mui/material";
import React from "react";

interface Props {
  type: "loading" | "no" | "gibbet" | "ok";
  user?: User;
}

const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  padding: `0px ${theme.spacing(1)}`,
  flex: 1,
  minHeight: 40,
  color: theme.palette.primary.contrastText,
  borderRadius: 4,
  boxSizing: "border-box",
  userSelect: "none",
}));

const CaptionBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  right: 0,
  paddingRight: theme.spacing(1),
}));

const CaptureResultTag = ({ type, user }: Props) => {
  const theme = useTheme();
  let jewels = "";
  let engraves = "";

  if (user) {
    user.engraves?.forEach((eng) => {
      engraves += eng[eng.length - 1];
    });

    const temp: { level: string; count: number }[] = [];

    user.jewels?.forEach((jewel) => {
      const level = jewel.name[0];
      const targetIndex = temp.findIndex((t) => t.level === level);
      if (targetIndex > -1) {
        temp[targetIndex].count += 1;
      } else {
        temp.push({ level, count: 1 });
      }
    });

    temp.sort((a, b) => Number(b.level) - Number(a.level));
    temp.forEach((t) => {
      jewels += ` ${t.level}레벨 ${t.count}개`;
    });
  }

  if (type === "ok")
    return (
      <StyledBox
        sx={{ bgcolor: theme.palette.success.light }}
        display="flex"
        justifyContent="space-between"
        position="relative"
      >
        <Typography variant="body2">😊 안전한 챈럼입니다.</Typography>
        <Typography variant="caption">
          {user?.charClass} / {user?.itemLevel}
        </Typography>
        <CaptionBox>
          <Typography variant="caption" color="text.secondary">
            각인 : {engraves} / 보석 : {jewels}
          </Typography>
        </CaptionBox>
      </StyledBox>
    );

  if (type === "gibbet")
    return (
      <StyledBox
        sx={{ bgcolor: theme.palette.error.light }}
        display="flex"
        justifyContent="space-between"
      >
        <Typography variant="body2">😈 효수 걸린 닉네임입니다.</Typography>
        <Typography variant="caption">
          {user?.charClass} / {user?.itemLevel}
        </Typography>
      </StyledBox>
    );

  if (type === "no")
    return (
      <StyledBox sx={{ border: `1px solid ${theme.palette.error.dark}` }}>
        <Typography variant="body2" color="error">
          존재하지 않는 유저입니다.
        </Typography>
      </StyledBox>
    );

  return (
    <Box pt={1} pl={1}>
      <CircularProgress size={20} />
    </Box>
  );
};

export default CaptureResultTag;
