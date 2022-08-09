import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import { Skill } from "../../service/UserService";
import ResultCard from "./ResultCard";

interface Props {
  skills: Skill[];
}

const ResultCharTripod = ({ skills }: Props) => {
  return (
    <ResultCard title="트라이포드">
      <Box display="flex" flexWrap="wrap">
        {skills.map((skill, index) => (
          <Box key={skill.name} width="50%" mb={1}>
            <Box mb={0.5}>
              <Chip label={skill.name} />
            </Box>
            {skill.tripods.map((tripod) => (
              <Typography variant="caption" key={tripod.efffect} ml={1}>
                {tripod.name} ({tripod.level.replace(" (최대)", "")})
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </ResultCard>
  );
};

export default ResultCharTripod;
