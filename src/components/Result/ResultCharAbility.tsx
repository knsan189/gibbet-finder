import { Box, Typography } from "@mui/material";
import React from "react";
import ResultCard from "./ResultCard";

interface Props {
  user?: User;
}

const ResultCharAbility = ({ user }: Props) => {
  if (!user) {
    return null;
  }
  const { abilities } = user;
  const parsedAbility: { title: string; value: any }[] = [];

  abilities?.forEach((item, index) => {
    if (index % 2 === 0) {
      const value = parseInt(abilities[index + 1], 10);
      parsedAbility.push({ title: item, value });
    }
  });

  return (
    <ResultCard title="특성">
      <Box display="flex" flexWrap="wrap">
        {parsedAbility?.map((ab) => (
          <Box key={ab.title} display="flex" width="50%">
            <Typography variant="body2" mr={1} gutterBottom>
              {ab.title}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {ab.value > 400 ? <strong>{ab.value}</strong> : ab.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </ResultCard>
  );
};

export default ResultCharAbility;
