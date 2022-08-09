import { Box, Chip, styled, Typography } from "@mui/material";
import React from "react";
import { User } from "../../@types/type";
import ResultCard from "./ResultCard";

interface Props {
  user?: User;
}

const ImgBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(0.3),
  height: 50,
  width: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  position: "relative",
}));

const ResultCharEngraves = ({ user }: Props) => {
  if (!user) return null;
  const { engraves, equipments } = user;
  return (
    <ResultCard title="각인">
      <Box display="flex">
        <Box flex={1}>
          {equipments.slot15.name && (
            <Box display="flex" flex={1} pb={2}>
              <ImgBox sx={{ borderRadius: "50%", width: 40, height: 40 }}>
                <img
                  src={equipments.slot15.img}
                  alt={equipments.slot15.name}
                  style={{ width: "100%" }}
                />
              </ImgBox>
              <Box ml={1}>
                <Typography variant="subtitle2">{equipments.slot15.name}</Typography>
                <Typography variant="caption">활성도 + {equipments.slot15.quality}</Typography>
              </Box>
            </Box>
          )}
          {equipments.slot14.name && (
            <Box display="flex" flex={1}>
              <ImgBox sx={{ borderRadius: "50%", width: 40, height: 40 }}>
                <img
                  src={equipments.slot14.img}
                  alt={equipments.slot14.name}
                  style={{ width: "100%" }}
                />
              </ImgBox>
              <Box ml={1}>
                <Typography variant="subtitle2">{equipments.slot14.name}</Typography>
                <Typography variant="caption">활성도 + {equipments.slot14.quality}</Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box display="flex" flex={1}>
          <Box flex={1} pl={2}>
            {engraves?.map((eng) => (
              <Typography variant="body2" key={eng} gutterBottom>
                {eng}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </ResultCard>
  );
};

export default ResultCharEngraves;
