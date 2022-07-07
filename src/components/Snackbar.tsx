import { Close, Info } from "@mui/icons-material";
import { Box, Card, CardActionArea, Divider, IconButton, styled, Typography } from "@mui/material";
import { SnackbarContent, SnackbarKey, SnackbarMessage, VariantType } from "notistack";
import React, { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { closeSnackbar } from "../redux/reducers/snackbar";

interface Props {
  id: SnackbarKey;
  message: SnackbarMessage;
  variant?: VariantType;
}

const StyledCard = styled(Card)(() => ({
  width: 330,
}));

const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  top: 0,
  right: 0,
}));

const HIDE_DURATION = 3000;

const Bar = styled(Divider, { shouldForwardProp: (prop) => prop !== "color" })(
  ({ theme, color }) => ({
    borderBottomWidth: 4,
    borderBottomColor: color === "error" ? theme.palette.error.main : theme.palette.primary.main,
    animation: `progress ${HIDE_DURATION}ms`,
    width: 0,
    "@keyframes progress": {
      "0%": {
        width: "100%",
      },
      "100%": {
        width: 0,
      },
    },
  }),
);

const Snackbar = forwardRef<HTMLDivElement, Props>(({ id, message, variant }, ref) => {
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closeSnackbar(id));
  };

  const color = variant === "error" ? "error" : "info";

  return (
    <SnackbarContent ref={ref}>
      <StyledCard elevation={5}>
        <CardActionArea
          sx={{ display: "flex", justifyContent: "start", alignItems: "center", p: 2 }}
        >
          <Box pr={2}>
            <Info fontSize="small" color={color} />
          </Box>
          <Typography variant="body2" component="pre">
            {message}
          </Typography>
        </CardActionArea>
        <CloseButton onClick={onClose} size="small">
          <Close fontSize="small" color="disabled" />
        </CloseButton>
        <Bar color={color} />
      </StyledCard>
    </SnackbarContent>
  );
});

Snackbar.defaultProps = {
  variant: "info",
};

export default Snackbar;
