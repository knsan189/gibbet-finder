import { ExpandMore } from "@mui/icons-material";
import { Box, CardHeader, Collapse, Divider, IconButton, Paper } from "@mui/material";
import React, { ReactNode, useState } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const ResultCard = ({ title, children }: Props) => {
  const [open, toggleOpen] = useState(true);
  const handleClick = () => {
    toggleOpen((prev) => !prev);
  };
  return (
    <Paper>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: "h6" }}
        action={
          <IconButton
            onClick={handleClick}
            sx={{
              transform: !open ? "rotate(0deg)" : "rotate(180deg)",
              marginLeft: "auto",
              transition: (theme) =>
                theme.transitions.create("transform", {
                  duration: theme.transitions.duration.shortest,
                }),
            }}
          >
            <ExpandMore />
          </IconButton>
        }
      />
      <Divider />
      <Collapse in={open}>
        <Box p={2}>{children}</Box>
      </Collapse>
    </Paper>
  );
};

export default ResultCard;
