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

const QualityBar = styled(Box)<{ quality?: number }>(({ quality }) => ({
  width: `${quality}%`,
  height: "100%",
  background: "black",
}));

const getBackground = (grade: number): string => {
  const purple = "linear-gradient(135deg,#27013d,#6e00aa)";
  const orange = "linear-gradient(135deg,#3c2201,#a86200)";
  const blue = "linear-gradient(135deg,#111d29,#103550)";
  const green = "linear-gradient(135deg,#1a230e,#374e18)";
  const brown = "linear-gradient(135deg,#341a09,#a24006)";
  const gray = "linear-gradient(135deg,#3d3325,#dcc999)";

  switch (grade) {
    case 1:
      return green;
    case 2:
      return blue;
    case 3:
      return purple;
    case 4:
      return orange;
    case 5:
      return brown;
    case 6:
      return gray;
    default:
      return green;
  }
};

const getColor = (quality: number) => {
  const green = "rgb(0, 183, 0)";
  const blue = "rgb(0, 84, 255)";
  const pink = "rgb(255, 0, 221)";
  const yellow = "rgb(219, 192, 0)";
  const orange = "rgb(255, 94, 0)";
  if (quality === 100) {
    return orange;
  }
  if (quality >= 90) {
    return pink;
  }
  if (quality < 90 && quality >= 70) {
    return blue;
  }
  if (quality < 70 && quality >= 30) {
    return green;
  }
  return yellow;
};

const getText = (grade: number) => {
  switch (grade) {
    case 1:
      return "일반";
    case 2:
      return "고급";
    case 3:
      return "희귀";
    case 4:
      return "전설";
    case 5:
      return "유물";
    case 6:
      return "고대";
    default:
      return "일반";
  }
};

const ResultCharEquip = ({ user }: Props) => {
  if (!user) {
    return null;
  }

  const { equipments, engraves } = user;

  return (
    <ResultCard title="장착 장비">
      <Box display="flex" flexWrap="wrap" mb={1}>
        {Object.keys(equipments).map((key, index) => {
          const equip = equipments[key];
          if (equip.name && index < 13)
            return (
              <Box key={key} width="50%" display="flex" mb={1}>
                <ImgBox sx={{ background: getBackground(equip.grade) }}>
                  <img src={equip.img} alt={equip.name} style={{ width: "80%" }} />
                  {equip.quality && equip.quality >= 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: 5,
                        borderTop: (theme) => `1px solid ${theme.palette.background.default}`,
                      }}
                    >
                      <QualityBar
                        quality={equip.quality}
                        sx={{ background: getColor(equip.quality) }}
                      />
                    </Box>
                  )}
                </ImgBox>
                <Box ml={1} display="flex" flexDirection="column">
                  <Typography variant="subtitle2">{equip.name}</Typography>
                  {equip.abilityList?.map((ab, index) => (
                    <Typography key={ab} variant="caption" color={index === 2 ? "error" : ""}>
                      {ab}
                    </Typography>
                  ))}
                  {equip.quality && equip.quality >= 0 && (
                    <Typography variant="caption">
                      {getText(equip.grade)} /{" "}
                      <span style={{ color: getColor(equip.quality) }}>품질 {equip.quality}</span>
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          return null;
        })}
      </Box>
      <Box
        p={2}
        sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
        width="50%"
      >
        <Chip label="장착 각인" sx={{ mb: 2 }} />
        <Box display="flex">
          <Box flex={1}>
            {equipments.slot15.name && (
              <Box display="flex" flex={1} pb={2}>
                <ImgBox sx={{ borderRadius: "50%" }}>
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
                <ImgBox sx={{ borderRadius: "50%" }}>
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
      </Box>
    </ResultCard>
  );
};

export default ResultCharEquip;
