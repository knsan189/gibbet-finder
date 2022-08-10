import { Avatar, Box, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { ENGRAVE_ICONS } from "../../utils/const";

interface Props {
  engrave: string;
}

const ResultCharEngrave = ({ engrave }: Props) => {
  const parsedEngrave = useMemo(() => {
    const [name, level] = engrave.split("Lv.").map((item) => item.trim());
    const icon = ENGRAVE_ICONS.find((icon) => icon.name === name);
    return { name, level, img: icon?.img };
  }, [engrave]);

  return (
    <Box display="flex" alignItems="center">
      <Avatar src={parsedEngrave.img} />
      <Box ml={1}>
        <Typography
          variant="subtitle2"
          lineHeight={1}
          color={parsedEngrave.name.includes("감소") ? "error" : ""}
        >
          {parsedEngrave.name}
        </Typography>
        <Typography
          variant="caption"
          lineHeight={1}
          color={parsedEngrave.name.includes("감소") ? "error" : ""}
        >
          Lv. {parsedEngrave.level}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResultCharEngrave;
