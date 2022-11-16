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

const CaptureResultTag = ({ type, user }: Props) => {
  const theme = useTheme();

  if (type === "ok")
    return (
      <StyledBox
        sx={{ bgcolor: theme.palette.success.light }}
        display="flex"
        justifyContent="space-between"
      >
        <Typography variant="body2">😊 안전한 챈럼입니다.</Typography>
        <Typography variant="caption">3 / 3 / 3 / 3 / 3 / 1</Typography>
      </StyledBox>
    );

  if (type === "gibbet")
    return (
      <StyledBox sx={{ bgcolor: theme.palette.error.light }}>
        <Typography variant="body2">😈 효수 걸린 닉네임입니다.</Typography>
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
