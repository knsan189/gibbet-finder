import { Box, CardHeader, Chip, Paper, styled, Typography } from "@mui/material";
import React from "react";
import { User } from "../../@types/type";
import { CARD_AWAKEN, CARD_IMG } from "../../utils/const";
import ResultCard from "./ResultCard";

const CardBox = styled(Box)<{ offset: number }>(({ theme, offset }) => ({
  borderRadius: theme.spacing(0.5),
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: "''",
    background: `url(${CARD_IMG}) no-repeat`,
    backgroundSize: "cover",
    backgroundPositionX: offset,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}));

const CardAwake = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 10,
  height: 36,
  width: "calc(100% - 10px)",
  left: "50%",
  transform: "translateX(-50%)",
  background: `url(${CARD_AWAKEN}) no-repeat`,
  backgroundSize: "cover",
  overflow: "hidden",
}));

const Awaken = styled("div")<{ awake: number }>(({ theme, awake }) => ({
  position: "absolute",
  bottom: 0,
  height: "100%",
  width: "calc(100%)",
  background: `url(${CARD_AWAKEN}) no-repeat`,
  backgroundSize: "cover",
  backgroundPositionY: -32,
  marginLeft: -21 * (5 - awake),
}));

interface Props {
  cards?: User["cards"];
}

const getBackground = (grade: number): number => {
  switch (grade) {
    case 1:
      return 0;
    case 2:
      return -121.5;
    case 3:
      return -244;
    case 4:
      return -367;
    case 5:
      return -609.5;
    default:
      return 0;
  }
};

const ResultCharCards = ({ cards }: Props) => {
  return (
    <ResultCard title="장착 카드">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {cards?.cardList.map((card, index) => (
          <Box key={index} width="16%" textAlign="center">
            <CardBox offset={getBackground(card.grade)}>
              <img src={card.img} alt={card.name} style={{ width: "100%" }} />
              <CardAwake>
                <Awaken awake={card.awaken} />
              </CardAwake>
            </CardBox>
            <Typography variant="caption">{card.name}</Typography>
          </Box>
        ))}
      </Box>
      <Box pb={2}>
        <Chip label="장착 효과" sx={{ mb: 1 }} />
        {cards?.cardSet.map((set, index) => (
          <Box key={index}>
            <Typography variant="body2">
              - {set.title} : {set.effect}
            </Typography>
          </Box>
        ))}
      </Box>
    </ResultCard>
  );
};

export default ResultCharCards;
