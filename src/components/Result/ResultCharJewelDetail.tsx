import { Box, Popover, Typography } from "@mui/material";
import React from "react";

interface Props {
  popover: HTMLElement | null;
  onClose: () => void;
  jewel?: Jewel;
}

const ResultCharJewelDetail = ({ onClose, popover, jewel }: Props) => {
  return (
    <Popover
      id="mouse-over-popover"
      sx={{ pointerEvents: "none" }}
      open={Boolean(popover)}
      anchorEl={popover}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={onClose}
      disableRestoreFocus
    >
      <Box p={1}>
        <Typography variant="subtitle2">{jewel?.name}</Typography>
        <Typography variant="body2">{jewel?.skill}</Typography>
      </Box>
    </Popover>
  );
};

export default ResultCharJewelDetail;
