import { Box, CardHeader, Paper, styled, Typography } from "@mui/material";
import React, { MouseEvent, useState } from "react";
import { Jewel } from "../../service/UserService";
import ResultCharJewelDetail from "./ResultCharJewelDetail";

const JewelBox = styled(Box)<{ grade: number }>(({ theme }) => ({
  borderRadius: theme.spacing(1),
  width: 60,
  height: 60,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

interface Props {
  jewels?: Jewel[];
}

const getBackground = (grade: number): string => {
  const purple = "linear-gradient(135deg,#27013d,#6e00aa)";
  const orange = "linear-gradient(135deg,#3c2201,#a86200)";
  const blue = "linear-gradient(135deg,#111d29,#103550)";
  const green = "linear-gradient(135deg,#1a230e,#374e18)";
  switch (grade) {
    case 1:
      return green;
    case 2:
      return blue;
    case 3:
      return purple;
    case 4:
      return orange;
    default:
      return green;
  }
};

const ResultCharJewels = ({ jewels }: Props) => {
  const [popover, setPopover] = useState<HTMLElement | null>(null);
  const [jewel, setJewel] = useState<Jewel>();

  const handleOpen = (event: MouseEvent<HTMLElement>, jewel: Jewel) => {
    setPopover(event.currentTarget);
    setJewel(jewel);
  };

  const onClose = () => {
    setPopover(null);
  };

  return (
    <Paper>
      <CardHeader title="장착 보석" titleTypographyProps={{ variant: "h6" }} />
      <Box px={2} pb={2} display="flex" justifyContent="space-between" alignItems="center">
        {jewels?.map((jewel, index) => (
          <Box textAlign="center" key={index}>
            <JewelBox
              grade={parseInt(jewel.grade, 10)}
              sx={{ background: getBackground(parseInt(jewel.grade, 10)) }}
              onMouseEnter={(event) => handleOpen(event, jewel)}
              onMouseLeave={onClose}
            >
              <img src={jewel.img} alt={jewel.info} style={{ width: "80%" }} />
            </JewelBox>
            <Typography variant="caption">{jewel.level}</Typography>
          </Box>
        ))}
      </Box>
      <ResultCharJewelDetail jewel={jewel} popover={popover} onClose={onClose} />
    </Paper>
  );
};

export default ResultCharJewels;
